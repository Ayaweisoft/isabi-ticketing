import React, { useState, useEffect } from 'react';
import { useLocation, Link, useParams } from 'react-router-dom';
import Logo from '../../assets/logo.png';

const Header = () => {
  const { pathname } = useLocation();
  const { id } = useParams();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [pathname]);

  const isDiscover = pathname === '/discover' || pathname === '/';
  const isAbout = pathname === '/about';
  const isTickets = !isDiscover && !isAbout && id && pathname === `/${id}`;
  const isVerify = pathname === `/check-ticket/${id}`;
  const isFindTicket = pathname === `/find-ticket/${id}`;

  const navItems = [
    { to: '/discover', label: 'Discover', active: isDiscover },
    ...(id ? [
      { to: `/${id}`, label: 'Buy Tickets', active: isTickets },
      { to: `/find-ticket/${id}`, label: 'Find My Ticket', active: isFindTicket },
      { to: `/check-ticket/${id}`, label: 'Verify', active: isVerify },
    ] : []),
    { to: '/about', label: 'About', active: isAbout },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
          scrolled || mobileOpen
            ? 'bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-xl shadow-black/30'
            : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-4 sm:px-8 lg:px-14 py-3 sm:py-4">
          {/* Logo */}
          <Link to="/discover" className="flex items-center gap-2 flex-shrink-0" aria-label="i-Sabi Home">
            <img
              src={Logo}
              alt="i-Sabi"
              className="h-9 sm:h-10 w-auto object-contain drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-0.5">
            {navItems.map(({ to, label, active }) => (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  active ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
                {active && <span className="w-1 h-1 rounded-full bg-[#22c55e]" />}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-white/5 border border-white/[0.07] text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-white/[0.06] bg-[#0a0a0a]/98 px-4 py-3 flex flex-col gap-1">
            {navItems.map(({ to, label, active }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'text-white bg-[#22c55e]/15 border border-[#22c55e]/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
                {active && (
                  <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                )}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
