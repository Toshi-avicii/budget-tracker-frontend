'use client';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { useEffect, useState } from "react";
import { z } from 'zod';
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from "@tanstack/react-query";
import { googleSignInFn, register } from "@/lib/helpers";
import { save } from "@/store/slices/auth.slice";
import { useAppDispatch } from "@/store/reduxHooks";
import { changeProfileWhenGoogleSignIn, changeProfileWhenRegister } from "@/store/slices/profile.slice";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { HiOutlineExclamationCircle } from "react-icons/hi2";
import clsx from "clsx";
import { motion } from 'motion/react'
import { RxCrossCircled } from "react-icons/rx";
import axios from "axios";
import { jwtDecode } from 'jwt-decode'

export interface SignUpFormData {
  username: string;
  email: string;
  password: string;
}

interface GoogleJwtPayload {
  id: string;
  name: string;
  email: string;
  isSignedUpWithGoogle: boolean;
  picture: string;
  iat: number;
  exp: number;
}

const formSchema = z.object({
  username: z.string().trim().min(2, {
    message: 'Username must be at least 2 characters long'
  }).max(30, {
    message: 'Username cannot be longer than 30 characters'
  }),
  email: z.string().trim().email('Email must be valid'),
  password: z.string().trim().min(5, 'Password must be at least 5 characters long').max(20, {
    message: 'Password cannot be longer than 20 characters'
  })
})

export default function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isAlertError, setIsAlertError] = useState<boolean>(false);
  const [isGoogleBtnClicked, setIsGoogleBtnClicked] = useState(false);
  const [formData] = useState<SignUpFormData>({
    email: '',
    password: '',
    username: ''
  });

  const { mutate, isError, error } = useMutation({
    mutationFn: register,
    onSuccess: async (data) => {
      setUserTokenCookie.mutate(data.data.token)
      dispatch(save(data.data.token));
      dispatch(changeProfileWhenRegister({
        email: data.data.email,
        username: data.data.username,
        isSignedUpWithGoogle: false
      }));
    },
    onError: () => {
      setIsAlertError(true);
    }
  });

  const setUserTokenCookie = useMutation({
    mutationFn: async (token: string) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/set-cookie`, {
        method: "POST",
        credentials: 'include', // used to receive/send cookies
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ token })
      });

      const response = await res.json();
      return response;
    },
    onError: () => {
      setIsAlertError(true);
    }
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      email: formData.email,
      password: formData.password,
      username: formData.username
    }
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  }

  const googleSignInMutation = useMutation({
    mutationFn: googleSignInFn,
    onSuccess: (data) => {
      setUserTokenCookie.mutate(data?.data.token)
      dispatch(save(data?.data.token));
      dispatch(changeProfileWhenGoogleSignIn({
        email: data?.data.email,
        username: data?.data.username,
        isSignedUpWithGoogle: data?.data.isSignedUpWithGoogle,
        avatarUrl: data?.data.avatarUrl
      }));
      router.replace('/dashboard');
    },
    onError: (error) => {
      console.log(error)
    }
  })

  useEffect(() => {
    const checkToken = async () => {
      if (!isGoogleBtnClicked) {
        const token = new URLSearchParams(window.location.search).get("token");
        try {
          if (!token) throw new Error("No token found");
          setIsGoogleBtnClicked(true)
          const decoded = jwtDecode<GoogleJwtPayload>(token);
          // Check expiration manually
          const currentTime = Math.floor(Date.now() / 1000);
          if (decoded.exp < currentTime) {
            throw new Error("Token has expired");
          }

          setUserTokenCookie.mutate(token)
          await axios.post('/api/set-token', { token });
          dispatch(save(token));
          dispatch(changeProfileWhenGoogleSignIn({
            email: decoded.email,
            username: decoded.name,
            isSignedUpWithGoogle: decoded.isSignedUpWithGoogle,
            avatarUrl: decoded.picture
          }));

          router.replace('/dashboard')

        } catch (err) {
          if (err instanceof Error) {
            console.log(err.message);
          }
        }
      }
    }

    checkToken()

  }, [isGoogleBtnClicked]);

  return (
    <>
      {
        (setUserTokenCookie.status === 'pending' || googleSignInMutation.status === 'pending') ?
          <Alert
            className={clsx("flex gap-2 justify-start items-center fixed top-12 right-4 z-10 text-white rounded-md shadow-md w-4/5 md:w-1/2 lg:w-1/5 animate-customTranslateLeft bg-slate-500")}
          >
            <AlertTitle>Sending Request...</AlertTitle>
          </Alert> : ((setUserTokenCookie.status === 'error' || isError || googleSignInMutation.status === "error") && isAlertError) ?
            <Alert
              className={clsx("fixed top-12 right-4 z-10 text-white rounded-md shadow-md w-4/5 md:w-1/2 lg:w-1/5 animate-customTranslateLeft bg-red-500")}
            >
              <Button
                style={{ color: 'white' }}
                className="absolute top-0 right-0 bg-transparent hover:bg-transparent shadow-none"
                onClick={() => {
                  setIsAlertError(false);
                }}
              >
                <RxCrossCircled />
              </Button>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 justify-start items-center"
              >
                <div>
                  <HiOutlineExclamationCircle className="text-lg" style={{ color: 'white' }} />
                </div>
                <div>
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {setUserTokenCookie.isError ?
                      setUserTokenCookie.error?.message :
                      error?.message
                    }
                  </AlertDescription>
                </div>
              </motion.div>
            </Alert>
            : null
      }
      <Form {...form}>
        <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Sign up</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Enter your email below to sign up your account
            </p>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@gmail.com" {...field} />
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
                        className="ml-auto text-sm underline-offset-4 hover:underline"
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

            <Button type="submit" className="w-full mb-3" disabled={setUserTokenCookie.status === 'pending'}>
              Sign Up
            </Button>
          </div>
        </form>
      </Form>

      <div className="space-y-3">
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Button variant="outline" className="p-0 w-full flex justify-center items-center">
          <Link 
            className='w-full h-full items-center justify-center flex gap-x-2' 
            // href="http://localhost:5000/api/auth/google"
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
          >
            <FcGoogle />
            Login with Google
          </Link>
        </Button>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </div>
    </>
  )
}
