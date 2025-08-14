"use client"
import React, { useEffect } from 'react'
import Navbar from './Navbar'
import { resumes } from '@/constants'
import ResumeCard from './ResumeCard'
import { usePuterStore } from '@/lib/puter'
import { usePathname, useRouter } from 'next/navigation'

const Hero = () => {
    const {auth} = usePuterStore()
    const router = useRouter()
    const pathname = usePathname()
    
    useEffect(() => {
        console.log(pathname)
        if(!auth.isAuthenticated){
            router.push('/auth?next=/')
        }
    },[auth.isAuthenticated])
  return (
    <main className='bg-[url(/images/bg-main.svg)] bg-cover'>
        <Navbar/>
        <section className="main-section">
            <div className='page-heading py-16'>
                <h1>Track Your Applications & Resume Ratings</h1>
                <h2>Review your submissions and check AI-powered feedback</h2>
            </div>
            {resumes.length > 0 &&(
                <section className="resumes-section">
                    {resumes.map((resume) => (
                        <ResumeCard key={resume.id} resume={resume}/>
                    ))}
                </section>
            )}
        </section>
        
        
        
    </main>
  )
}

export default Hero