import React from 'react'


const GentleLoader = () => {
    

    

  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-white bg-opacity-50">
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-md shadow-md">
      <p className='mb-4 text-sm font-semibold'>Loading...</p>
      <div className="w-12 h-1 rounded-full bg-[#348A40] animate-pulse"></div>
    </div>
  </div>
  )
}

export default GentleLoader