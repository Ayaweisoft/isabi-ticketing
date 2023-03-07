import React from 'react'

const Footer = ({ data }) => {
  return (
    <div className='flex justify-center items-center bg-[#07360e] flex-col py-8 px-16 gap-4'>
      <h1 className='font-bold text-white text-xl'>About Event</h1>
      <img className='h-32 w-32' src={data?.image_url} alt="" srcset="" />
      <p className='text-white text-center'>{ data?.aboutEvent }</p>
      <p className="font-medium text-white">Copyright  i.sabi v2 2021</p>
    </div>
  )
}

export default Footer;