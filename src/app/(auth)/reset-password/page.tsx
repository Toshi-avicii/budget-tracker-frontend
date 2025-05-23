'use client';

import AppLoading from '@/components/AppLoading';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { resetPasswordFn } from '@/lib/helpers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
    password: z.string().trim().min(5, 'Password must be at least 5 characters long').max(20, {
        message: 'Password cannot be longer than 20 characters'
    }),
    confirmPassword: z.string().trim().min(5, 'Password must be at least 5 characters long').max(20, {
        message: 'Password cannot be longer than 20 characters'
    })
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
})

function ResetLink() {
    const searchParams = useSearchParams();
    const [formData] = useState({
        password: '',
        confirmPassword: ''
    });

    // Get all keys from the query string
    const keys = Array.from(searchParams.keys());
    const urlQueryToken = searchParams.get(keys[0]);
    const router = useRouter();

    const resetPasswordForm = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        values: {
            password: formData.password,
            confirmPassword: formData.confirmPassword
        }
    });

    const resetPasswordMutation = useMutation({
        mutationFn: resetPasswordFn,
        onSuccess: (data) => {
            console.log(data);
            router.replace('/sign-in');
        },
        onError: (data) => {
            console.log(data);
        }
    })

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        resetPasswordMutation.mutate({
            password: values.password,
            token: urlQueryToken ? urlQueryToken : ''
        })
    }

    return (
        <div className="min-h-screen flex justify-center items-center flex-col p-2 bg-muted">
            <div className="w-full lg:w-7/12 flex flex-col lg:flex-row lg:min-h-80 min-h-full rounded-lg shadow-md p-4 lg:p-0 bg-primary-foreground">
                {/* image and text */}
                <div className="reset-pass-bg flex-1 rounded-s-lg min-h-52">
                    {/* logo */}
                    <div></div>
                </div>
                {(!resetPasswordMutation.isIdle && resetPasswordMutation.isPending) && <AppLoading />}

                {(!resetPasswordMutation.isIdle && (resetPasswordMutation.isError && axios.isAxiosError(resetPasswordMutation.error))) &&
                    <Alert
                        className={clsx('fixed right-4 top-4 animate-customTranslateLeft z-10 w-1/3', (resetPasswordMutation.isPending) ? 'bg-gray-500' : (resetPasswordMutation.isError) && 'bg-rose-600')}
                    >
                        {(resetPasswordMutation.isError) && <>
                            <AlertTitle className='text-white rounded-md shadow-md'>Error Occurred</AlertTitle>
                            <AlertDescription className='text-white'>
                                {resetPasswordMutation.error.response?.data.message || resetPasswordMutation.error.message}
                            </AlertDescription>
                        </>}
                    </Alert>
                }

                {
                    (!resetPasswordMutation.isIdle && resetPasswordMutation.isSuccess) &&
                    <Alert className={clsx('fixed right-4 top-4 animate-customTranslateLeft z-10 w-1/3 bg-emerald-400 text-white')}>
                        <AlertTitle>{resetPasswordMutation.data.data?.message}</AlertTitle>
                    </Alert>
                }
                <div className="flex-1 flex flex-col justify-between items-start text-primary p-6 lg:p-8 rounded-e-lg">
                    <h3>Reset Password</h3>
                    <Form {...resetPasswordForm}>
                        <form onSubmit={resetPasswordForm.handleSubmit(handleSubmit)} className="w-full">
                            <FormField
                                control={resetPasswordForm.control}
                                name="password"
                                render={({ field }) => {
                                    return (
                                        <div className="my-2 w-full">
                                            <FormLabel className={clsx("my-3 inline-block text-lg")}>New Password</FormLabel>
                                            <FormControl className="">
                                                <Input type="password" placeholder="Your new password" {...field} className="dark:border-gray-500 min-w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    )
                                }}
                            />

                            <FormField
                                control={resetPasswordForm.control}
                                name="confirmPassword"
                                render={({ field }) => {
                                    return (
                                        <div className="my-2 w-full">
                                            <FormLabel className={clsx("my-3 inline-block text-lg")}>Confirm Password</FormLabel>
                                            <FormControl className="">
                                                <Input type="text" placeholder="Confirm password" {...field} className="dark:border-gray-500 min-w-full" />
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    )
                                }}
                            />
                            <Button
                                type="submit"
                                className="w-full my-3"
                            >
                                Reset Password
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default ResetLink;