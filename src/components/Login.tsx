'use client';

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from './ui/button'
import { FcGoogle } from 'react-icons/fc'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import Link from 'next/link'
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { googleSignInFn, login, requestCookie } from '@/lib/helpers'
import { Alert, AlertDescription, AlertTitle } from './ui/alert'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store/reduxHooks'
import { save } from '@/store/slices/auth.slice'
import { changeProfileWhenGoogleSignIn, changeProfileWhenRegister } from '@/store/slices/profile.slice'
import AppLoading from './AppLoading'
import { signIn, useSession } from 'next-auth/react'


export interface LoginFormData {
    email: string;
    password: string;
}

const formSchema = z.object({
    email: z.string().trim().email('Email must be valid'),
    password: z.string().trim().min(5, 'Password must be at least 5 characters long').max(20, {
        message: 'Password cannot be longer than 20 characters'
    })
});

function Login({
    className,
    ...props
}: React.ComponentPropsWithoutRef<'form'>) {
    const [formData] = useState<LoginFormData>({
        email: '',
        password: ''
    });

    const { data: session } = useSession();
    const dispatch = useAppDispatch();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: {
            email: formData.email,
            password: formData.password
        }
    });

    const loginMutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            console.log(data);
            setUserTokenCookie.mutate(data?.data.token);
            dispatch(save(data?.data.token));
            dispatch(changeProfileWhenRegister({
                email: data?.data.email,
                username: data?.data.username,
                isSignedUpWithGoogle: data?.data.isSignedUpWithGoogle
            }));
        },
        onError: (error) => {
            console.log(error);
        }
    });

    const googleSignInMutation = useMutation({
        mutationFn: googleSignInFn,
        onSuccess: (data) => {
          setUserTokenCookie.mutate(data.data.token)
          dispatch(save(data.data.token));
          dispatch(changeProfileWhenGoogleSignIn({
            email: data.data.email,
            username: data.data.username,
            isSignedUpWithGoogle: data.data.isSignedUpWithGoogle,
            avatarUrl: data.data.avatarUrl
          }));
        },
        onError: (error) => {
          console.log(error)
        }
    });

    const setUserTokenCookie = useMutation({
        mutationFn: async (token: string) => {
            await requestCookie(token);
        },
        onSuccess: () => {
            router.replace('/dashboard');
        }
    });

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        loginMutation.mutate(values);
    }

    const googleSignIn = async() => {
        try {
            const result = await signIn("google", { redirect: false, redirectTo: '/dashboard' });
            if(result?.error) {
                throw new Error('Google sign in failed');
            } else {
                if (session) googleSignInMutation.mutate(session);
            }

        } catch(err) {
            if(err instanceof Error) {
                console.log(err.message);
            }
        }
    }

    return (
        <>
            {
                ((!loginMutation.isIdle && (loginMutation.isPending || setUserTokenCookie.isPending)) || (!googleSignInMutation.isIdle || googleSignInMutation.isPending)) && <AppLoading />
            }
            {(!loginMutation.isIdle && (loginMutation.isError || setUserTokenCookie.isError)) &&
                <Alert
                    className={clsx('fixed right-4 top-4 animate-customTranslateLeft z-10 w-1/3', (loginMutation.isPending || setUserTokenCookie.isPending) ? 'bg-gray-500' : (loginMutation.isError || setUserTokenCookie.isError) && 'bg-rose-600')}
                >
                    {(loginMutation.isError || setUserTokenCookie.isError) && <>
                        <AlertTitle className='text-white rounded-md shadow-md'>Error Occurred</AlertTitle>
                        <AlertDescription className='text-white'>
                            {loginMutation.error ? loginMutation.error.message : setUserTokenCookie.error?.message}
                        </AlertDescription>
                    </>}
                </Alert>
            }

            <div className="flex flex-col gap-4 mb-6">
                <Button variant="outline" className="w-full" onClick={googleSignIn}>
                    <FcGoogle />
                    Login with Google
                </Button>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} {...props}>
                    <div className="grid gap-6">

                        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                            <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="user@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center">
                                                <FormLabel>Password</FormLabel>
                                                <Link
                                                    href="/forgot-password"
                                                    className="ml-auto md:text-sm underline-offset-4 hover:underline text-xs"
                                                >
                                                    Forgot your password?
                                                </Link>
                                            </div>
                                            <FormControl>
                                                <Input type="password" placeholder="******" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={(loginMutation.isPending || setUserTokenCookie.isPending)}>
                                Login
                            </Button>
                        </div>
                        <div className="text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/" className="underline underline-offset-4">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </form>
            </Form>
        </>
    )
}

export default Login