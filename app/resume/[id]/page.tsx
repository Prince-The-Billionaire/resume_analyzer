"use client"
import ATS from '@/components/ATS'
import Details from '@/components/Details'
import Summary from '@/components/Summary'
import { usePuterStore } from '@/lib/puter'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {
  const {id} = useParams()
  const {auth, isLoading, fs, kv} = usePuterStore()
  const [imageUrl, setImageUrl] = React.useState('')
  const [resumeUrl, setResumeUrl] = React.useState('')
  const [feedback, setFeedback] = React.useState<Feedback | null>(null)
  
  const router = useRouter()

  useEffect(() => {
        if(!isLoading && !auth.isAuthenticated){
            router.push(`/auth?next=/resume/${id}`)
        }
    },[isLoading])
  useEffect(() => {
    const loadResume = async() => {
      const resume = await kv.get(`resume:${id}`)
      if(!resume) return;

      const data = JSON.parse(resume)
      console.log("power" + data.feedback)
      const resumeBlob = await fs.read(data.resumePath)

      if(!resumeBlob) return;

      const pdfBlob = new Blob([resumeBlob], { type: 'application/pdf' })
      const resumeUrl = URL.createObjectURL(pdfBlob)
      setResumeUrl(resumeUrl)
      const imageBlob = await fs.read(data.imagePath)
      if(!imageBlob) return
      const imageUrl = URL.createObjectURL(imageBlob)
      setImageUrl(imageUrl)
      console.log(data)
      setFeedback(data.feedback)
      console.log(data.feedback)
    }
    loadResume()
    
  },[])
  
  return (
    <main className="!pt-0">
      <nav className='resume-nav'>
        <Link href={'/'} className='back-button'>
          <Image src="/icons/back.svg" alt="back" className='w-4 h-4' width={100} height={100}/>
          <span className='text-gray-800 text-sm font-semibold'>Back to HomePage</span>
        </Link>
      </nav>
      
      <div className="flex flex-row w-full max-kg:flex-col-reverse">
        <section className='feedback-section bg-[url(/images/bg-small.svg)] bg-cover h-[100vh] sticky top-0 items-center justify-around'>
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-xl:h-fit w-fit">
                <a href={resumeUrl} target='_blank' rel="noopener noreferrer">
                  <Image src={imageUrl} className='w-full h-full object-contain rounded-2xl' alt='resume' width={100} height={100} />
                </a>
            </div>
          )}
        </section>
        <section>
          <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
                <Summary feedback={feedback}/>
                {/* <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []}/>
                <Details feedback={feedback}/> */}
            </div>
          ):(
            <Image alt={"loading"} width={100} height={100} src={'/images/resume-scan-2.gif'} className='w-full'/>
          )}
        </section>
      </div>
    </main>
  )
}

export default page