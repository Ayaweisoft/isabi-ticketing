import React from 'react'
import { useLocation, Link, useParams } from 'react-router-dom'
import Menu from "../../assets/menu.svg"

const Header = () => {
  const { pathname } = useLocation()
  const { id } = useParams();
	console.log(id)

  return (
    <header className='fixed top-0 left-0 z-10 flex items-center justify-between w-full px-4 py-2 bg-[#07360e] shadow-md md:py-5 md:px-10 lg:px-24'>
      <div>
        {/* <img src={Logo} alt="" className='h-16 md:h-12' /> */}
      </div>
      <nav className="items-center hidden w-full md:flex gap-x-14 md:gap-4 lg:gap-7">
        <ul className='flex flex-col items-center justify-center w-full text-sm font-medium md:flex-row text-dark-light gap-7 md:gap-4 lg:gap-7'>
          <li><Link to={`/${id}`} className={`${pathname==="/" + id && "text-white border-b-2"} pb-1.5 px-1 font-medium text-white`}>Ticket</Link></li>
          <li><Link to={`/check-ticket/${id}`} className={`${pathname==="/check-ticket/" + id && "text-white border-b-2"} pb-1.5 px-1 text-white font-medium`}>Check Ticket</Link></li>
        </ul>
        <Link to="/login">
        </Link>
      </nav>
      <img src={Menu} alt="" className='w-8 md:hidden' />
    </header>
  )
}

export default Header;