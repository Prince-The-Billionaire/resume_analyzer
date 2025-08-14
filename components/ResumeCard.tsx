import Link from 'next/link'
import React from 'react'
import ScoreCircle from './ScoreCircle'
import Image from 'next/image'

const ResumeCard = ({resume:{id, companyName, jobTitle, feedback, resumePath, imagePath}} : {resume:Resume}) => {
  return (
    <Link href={`/resume/${id}`} className='resume-card animate-in fade-in duration-`1000'>
        <div className={'resume-card-header'}>
            <div className="flex flex-col gap-2">
                <h2 className='!text-black font-bold break-words'>
                    {companyName}
                </h2>
                <h3 className='text-lg break-words text-gray-500'>{jobTitle}</h3>
            </div>
            <div className="flex-shrink-0">
                <ScoreCircle score={feedback.overallScore} />
            </div>
        </div>
        <div className='gradient-border animate-in fade-in duration-1000'>
            <div className="w-full h-full">
                <Image 
                    src={imagePath}
                    width={100}
                    height={300}
                    alt="resume"
                    className='w-full h-[350px] max-sm:h-[200px] object-cover object-top'
                />
            </div>
        </div>
        
    </Link>
  )
}

export default ResumeCard