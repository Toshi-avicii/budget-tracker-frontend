'use client';

import { GalleryVerticalEnd } from "lucide-react"
import SignUpForm from "@/components/SignUpForm"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/reduxHooks";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();
  const token = useAppSelector(state => state.auth.token);

  useEffect(() => {
    if(token) {
      router.replace('/dashboard');
    }
  }, [router, token])

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/kevin-matos-Nl_FMFpXo2g-unsplash.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.9]"
          width="1000"
          quality={100}
          height="1000"
          loading="lazy"
        />
      </div>
    </div>
  )
}
