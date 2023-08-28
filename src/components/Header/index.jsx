import React from 'react'
import { useLocation, Link, useParams } from 'react-router-dom'
import Menu from "../../assets/menu.svg"
import Logo from "../../assets/isab.png"

const Header = () => {
  const { pathname } = useLocation()
  const { id } = useParams();
  // console.log(id)

  return (
    <header className='fixed top-0 left-0 z-10 flex items-center justify-between w-full px-4 py-4 bg-[#348A40] shadow-md md:py-5 md:px-10 lg:px-24'>
    {/* <header className='fixed top-0 left-0 z-10 flex items-center justify-between w-full px-4 py-4 bg-[#07360e] shadow-md md:py-5 md:px-10 lg:px-24'> */}
      <div className='flex w-full'>
        {/* <Link to="/" className='text-2xl font-bold text-white'>
          <img src={Logo} alt="logo" className="w-16 h-8" />
        </Link> */}
        <Link to="/" className='text-xl font-semibold text-white'>I-SABI</Link>
      </div>
      <nav className="flex items-center justify-end w-full md:flex gap-x-14 md:gap-4 lg:gap-7">
        <ul className='flex flex-row items-center justify-end text-sm font-medium list-none text-dark-light gap-7 md:gap-4 lg:gap-7'>
          <li><Link to={`/${id}`} className={`${pathname === "/" + id && "text-white border-b-2"} pb-1.5 px-1 font-medium text-white`}>Ticket</Link></li>
          <li><Link to={`/check-ticket/${id}`} className={`${pathname === "/check-ticket/" + id && "text-white border-b-2"} pb-1.5 px-1 text-white font-medium whitespace-nowrap`}>Check Ticket</Link></li>
        </ul>
        {/* <Link to="/login">
        </Link> */}
      </nav>
    </header>
  )
}

export default Header;