"use client"
import { usePuterStore } from '@/lib/puter';
import { Metadata } from 'next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react'

const metadata: Metadata = {
  title: "CVanalyze | Auth",
  description: "Log Into your account",
};

const page = () => {
    const {isLoading,auth} = usePuterStore()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "/";
    useEffect(() => {
        if (auth.isAuthenticated) {
        router.push(next);
        }
    }, [auth.isAuthenticated, next, router]);
  return (
    <main className='bg-[url(/images/bg-auth.svg)] bg-cover w-screen min-h-screen flex items-center justify-center'>
        
        <div className="gradient-border shadow-lg">
            <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                <div className='flex flex-col items-center gap-2 text-center '>
                    <h1>Welcome</h1>
                    <h2>Log In to Continue</h2>
                </div>
                <div>
                    {isLoading ? (
                        <button className="auth-button animate-pulse">
                            <p>Signing you in....</p>
                        </button>
                    ):(
                        <>
                            {auth.isAuthenticated ? (
                                <button className="auth-button" onClick={auth.signOut}>
                                    <p>Log Out</p>
                                </button>
                            ) : (
                                <button className="auth-button" onClick={auth.signIn}>
                                    <p>Log In</p>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    </main>
  )
}

export default page