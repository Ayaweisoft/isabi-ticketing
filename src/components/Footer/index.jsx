import React from 'react'

const Footer = ({ data }) => {
  return (
    <>
      <div className='flex justify-center items-center bg-[#EEF7EE] flex-col py-8 px-16 gap-4 md:pb-12'>
      {/* <div className='flex justify-center items-center bg-[#07360e] flex-col py-8 px-16 gap-4'> */}
        <h1 className='text-xl font-bold text- md:mb-4'>About Event</h1>
        <div className="relative flex flex-col items-center justify-center w-full gap-4 md:gap-8 md:flex-row h-fit">
          <img className='flex-1 md:min-h-[400px] object-cover w-32 h-32 md:rounded-sm' src={data?.image_url} alt="" srcset="" />
          <p className='flex-1 text-center md:text-left'>{ data?.aboutEvent }</p>
        </div>
      </div>
        <p className="font-medium text-white text-center py-2 bg-[#348A40] text-sm">copyright @ i-sabi 2023</p>
    </>
  )
}

export default Footer;


// import React from 'react'

// const Footer = ({ data }) => {
//   return (
//     <div className='flex justify-center items-center bg-[#EEF7EE] flex-col py-8 px-16 gap-4'>
//     {/* <div className='flex justify-center items-center bg-[#07360e] flex-col py-8 px-16 gap-4'> */}
//       <h1 className='text-xl font-bold text-'>About Event</h1>
//       <img className='w-32 h-32' src={data?.image_url} alt="" srcset="" />
//       <p className='text-center text-'>{ data?.aboutEvent }</p>
//       <p className="font-medium text-">copyright  i.sabi v2 2021</p>
//     </div>
//   )
// }

// export default Footer;