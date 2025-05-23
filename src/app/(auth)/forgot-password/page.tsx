'use client';

import AppLoading from "@/components/AppLoading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordFn } from "@/lib/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const resetPasswordFormSchema = z.object({
  email: z.string().email({
    message: 'Email must be valid'
  })
});

interface FormData {
  email: string;
}

function ForgotPasswordPage() {
  const [formData] = useState<FormData>({
    email: ''
  });

  const form = useForm<z.infer<typeof resetPasswordFormSchema>>({
    resolver: zodResolver(resetPasswordFormSchema),
    values: {
      email: formData.email
    }
  });

  const formMutation = useMutation({
    mutationFn: forgotPasswordFn,
    onSuccess: (data) => {
      console.log(data);
    }
  });

  const handleSubmit = async (values: z.infer<typeof resetPasswordFormSchema>) => {
    formMutation.mutate(values);
  }

  return (
    <div className="min-h-screen flex justify-center items-center flex-col p-2 bg-muted">
      <div className="w-full lg:w-7/12 flex flex-col lg:flex-row lg:min-h-80 min-h-full rounded-lg shadow-md p-4 lg:p-0 bg-primary-foreground">
        {/* image and text */}
        <div className="forgot-pass-bg flex-1 rounded-s-lg min-h-52">
          {/* logo */}
          <div></div>
          {/* <div className="text-white p-4">
            <h3>Forgot password</h3>
            <p>Privacy Policy</p>
          </div> */}
        </div>
        { (!formMutation.isIdle && formMutation.isPending) && <AppLoading /> }
        
        {(!formMutation.isIdle && (formMutation.isError && axios.isAxiosError(formMutation.error))) &&
          <Alert
            className={clsx('fixed right-4 top-4 animate-customTranslateLeft z-10 w-1/3', (formMutation.isPending) ? 'bg-gray-500' : (formMutation.isError) && 'bg-rose-600')}
          >
            {(formMutation.isError) && <>
              <AlertTitle className='text-white rounded-md shadow-md'>Error Occurred</AlertTitle>
              <AlertDescription className='text-white'>
                {formMutation.error.response?.data.message || formMutation.error.message}
              </AlertDescription>
            </>}
          </Alert>
        }

        {
          (!formMutation.isIdle && formMutation.isSuccess) && 
          <Alert className={clsx('fixed right-4 top-4 animate-customTranslateLeft z-10 w-1/3 bg-emerald-400 text-white')}>
            <AlertTitle>{formMutation.data.data?.message}</AlertTitle>
            <AlertDescription>Check Your Email</AlertDescription>
          </Alert>
        }
        <div className="flex-1 flex flex-col justify-between items-start text-primary p-6 lg:p-8 rounded-e-lg">
          <h3>Forgot Password</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <div className="my-2 w-full">
                      <FormLabel className={clsx("my-3 inline-block text-lg")}>Email</FormLabel>
                      <FormControl className="">
                        <Input type="email" placeholder="Your email id" {...field} className="dark:border-gray-500 min-w-full" />
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
                Send Mail
              </Button>
            </form>
          </Form>

          <div className="flex gap-1 text-sm mt-3 flex-col md:flex-row">
            <p>Already have an account?</p>
            <Link href="/sign-in" className="underline">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage;