import React from 'react'; // React import required for React 16
import { useLocation, Link, useParams } from 'react-router-dom'; // Hooks from React Router v6 (you'll need React Router v6 installed)
import Menu from "../../assets/menu.svg";
import Logo from "../../assets/isab.png";

const Header = () => {
  const { pathname } = useLocation(); // React Router v6 Hook
  const { id } = useParams(); // React Router v6 Hook

  return (
    <header className="fixed top-0 left-0 z-10 flex items-center justify-between w-full px-4 py-4 bg-[#348A40] shadow-md md:py-5 md:px-10 lg:px-24">
      <div className="flex w-full">
        <Link to="/" className="text-xl font-semibold text-white">I-SABI</Link>
      </div>
      <nav className="flex items-center justify-end w-full md:flex gap-x-14 md:gap-4 lg:gap-7">
        <ul className="flex flex-row items-center justify-end text-sm font-medium list-none text-dark-light gap-7 md:gap-4 lg:gap-7">
          <li>
            <Link to={`/${id}`} className={`${pathname === "/" + id && "text-white border-b-2"} pb-1.5 px-1 font-medium text-white`}>
              Ticket
            </Link>
          </li>
          <li>
            <Link to={`/check-ticket/${id}`} className={`${pathname === "/check-ticket/" + id && "text-white border-b-2"} pb-1.5 px-1 text-white font-medium whitespace-nowrap`}>
              Check Ticket
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
