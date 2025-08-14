import Link from 'next/link'
import React from 'react'

const Navbar = () => {
  return (
    <nav className='navbar'>
        <Link href={'/'}>
            <p className='text-2xl font-bold text-gradient '>CVanalyze</p>
        </Link>
        <Link href={'/upload'} className="primary-button w-fit">
            Upload
        </Link>
    </nav>
  )
}

export default Navbar