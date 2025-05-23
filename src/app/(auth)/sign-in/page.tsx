'use client';

import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/LoginForm"
import { useAppDispatch, useAppSelector } from "@/store/reduxHooks";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getToken } from "@/lib/helpers";
import { remove } from "@/store/slices/auth.slice";

export default function LoginPage() {
  const token = useAppSelector(state => state.auth.token);
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  // call the get-token query when the component mounts
  useQuery({
    queryKey: ['get-token-query'],
    queryFn: async() => {
      try {
        const result = await getToken();
        if(result && token) {
          router.replace('/dashboard');
        } else {
          dispatch(remove());
        }
        return result;
      } catch(err) {
        dispatch(remove());
        if(err instanceof Error) throw new Error(err.message);
      }
    }
  });
  
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
