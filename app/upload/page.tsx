"use client"
import Navbar from '@/components/Navbar'
import React, { FormEvent, useState } from 'react'
import Image from 'next/image'
import FileUploader from '@/components/FileUploader'
import { usePuterStore } from '@/lib/puter'
import { useRouter } from 'next/navigation'
import { convertPdfToImage } from '@/lib/pdf2img'
import { generateUUID } from '@/lib/util'
import { AIResponseFormat, prepareInstructions } from '@/constants'

const page = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const [statusText, setStatusText] = useState('')
  const [file, setFile] = useState<File | null>(null)

  const handleFileSelect = (file: File | null) => {
    setFile(file)
  }

  const safeParseFeedback = (raw: any) => {
    try {
      if (typeof raw === "object") return raw
      if (typeof raw === "string") {
        let parsed = JSON.parse(raw) // first parse
        if (typeof parsed === "string") {
          parsed = JSON.parse(parsed) // second parse if still a string
        }
        return parsed
      }
    } catch (err) {
      console.error("Failed to parse AI feedback:", err, raw)
      return null
    }
    return null
  }

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file
  }: {
    companyName: string
    jobTitle: string
    jobDescription: string
    file: File
  }) => {
    setIsProcessing(true)
    setStatusText('Uploading the file.....')
    const uploadedFile = await fs.upload([file])

    if (!uploadedFile) return setStatusText('Error: Failed to upload file')

    setStatusText('Converting to image....')
    const imageFile = await convertPdfToImage(file)
    if (!imageFile?.file) return setStatusText('Error: Failed to convert PDF to image')

    setStatusText('Uploading the image....')
    const uploadedImage = await fs.upload([imageFile.file])
    if (!uploadedImage) return setStatusText('Error: Failed to upload image')

    setStatusText('Preparing data.....')
    const uuid = generateUUID()

    const data: any = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: ''
    }

    setStatusText('Analyzing resume....')
    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({ jobTitle, jobDescription, AIResponseFormat })
    )

    if (!feedback) return setStatusText('Error: Failed to analyze resume')

    // Extract the text from the AI response
    const feedbackText =
      typeof feedback.message.content === 'string'
        ? feedback.message.content
        : feedback.message.content[0]?.text

    const parsedFeedback = safeParseFeedback(feedbackText)
    if (!parsedFeedback) return setStatusText('Error: AI returned invalid JSON format')

    data.feedback = parsedFeedback

    setStatusText('Analysis complete, redirecting....')
    await kv.set(`resume:${uuid}`, JSON.stringify(data))
    router.push(`/resume/${uuid}`)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget.closest('form')
    if (!form) return
    const formData = new FormData(form)

    const companyName = formData.get('company-name') as string
    const jobTitle = formData.get('job-title') as string
    const jobDescription = formData.get('job-description') as string

    if (!file) return
    handleAnalyze({ companyName, jobTitle, jobDescription, file })
  }

  return (
    <main className='bg-[url(/images/bg-main.svg)] bg-cover'>
      <Navbar />

      <section className='main-section'>
        <div className='page-heading py-16'>
          <h1>Smart Feedback For Your Dream Job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <Image
                alt="resume scanning"
                src={'/images/resume-scan.gif'}
                className='w-full'
                width={300}
                height={300}
              />
            </>
          ) : (
            <h2>Drop Your Resume for an ATS score and improvement tips</h2>
          )}

          {!isProcessing && (
            <form
              id="upload-form"
              onSubmit={handleSubmit}
              className='flex flex-col gap-4 mt-8'
            >
              <div className="form-div">
                <label htmlFor='company-name'>Company Name</label>
                <input type="text" name="company-name" placeholder="Company Name" />
              </div>
              <div className="form-div">
                <label htmlFor='job-title'>Job Title</label>
                <input type="text" name="job-title" placeholder="Job Title" />
              </div>
              <div className="form-div">
                <label htmlFor='job-description'>Job Description</label>
                <textarea rows={5} name="job-description" placeholder="Job Description" />
              </div>

              <div className="form-div">
                <label htmlFor='uploader'>Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button className='primary-button' type='submit'>
                Analyze Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}

export default page
