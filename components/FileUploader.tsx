import { formatSize } from '@/lib/util'
import Image from 'next/image'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface FileUploaderProps {
    onFileSelect?: (file:File | null) => void
}

const FileUploader = ({onFileSelect}:FileUploaderProps) => {
    
    const onDrop = useCallback((acceptedFiles:File[]) => {
        const file = acceptedFiles[0] || null

        onFileSelect?.(file)
    },[onFileSelect])

    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        onDrop,
        multiple:false,
        accept:{'application/pdf' : ['.pdf']},
        maxSize: 20 * 1024 * 1024
    })

    const file = acceptedFiles[0] || null
  return (
    <div className='w-full gradient-border'>
        <div {...getRootProps()}>
            <input {...getInputProps()}/>
            <div className="space-y-4 cursor-pointer">


                {file ? (
                    <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                        <div className='flex items-center space-x-3'>
                            <Image src="/images/pdf.png" alt="pdf" className="size-10" width={100} height={100}/>
                            <div>
                                <p className='text-sm font-medium text-gray-700 max-w-xs truncate'>
                                    {file.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {formatSize(file.size)}
                                </p>
                            </div>
                        </div>
                        <button className='p-2 cursor-pointer' onClick={(e) => {
                            onFileSelect?.(null)
                        }}>
                            <Image src="/icons/cross.svg" alt="remove" className='w-4 h-4' width={100} height={100} />
                        </button>
                    </div>
                ):(
                    <div>
                        <div className="mx-auto w-16 h-16 flex items-center jusitfy-center mb-2">
                            <Image src={'/icons/info.svg'} alt='upload' className='size-20' width={100} height={100}/>
                        </div>
                        <p className='text-lg text-gray-500'>
                            <span className="font-semibold">
                                Click to Upload
                            </span> or drag and drop
                        </p>
                        <p className="text-lg text-gray-500">PDF (max 20 MB)</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  )
}

export default FileUploader