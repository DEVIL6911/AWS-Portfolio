import { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/technical-team', label: 'Technical Team' },
  { to: '/community-team', label: 'Community Team' },
  { to: '/event-coordination', label: 'Event Coordination' },
  { to: '/event-management', label: 'Event Management' },
  { to: '/marketing-team', label: 'Marketing Team' },
  { to: '/founding-members', label: 'Founding Members', isCta: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <img
            src={logoUrl}
            alt="AWS Cloud Club"
            className="navbar__logo-img"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextElementSibling.style.display = 'flex';
            }}
          />
          <span className="navbar__logo-fallback" style={{ display: 'none' }}>
            <i className="fa-solid fa-cloud"></i>
          </span>
          <span className="navbar__title">Cloud Club</span>
        </Link>

        <button
          className={`navbar__toggle${menuOpen ? ' active' : ''}`}
          id="navToggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`navbar__links${menuOpen ? ' open' : ''}`} id="navLinks">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `nav-link${link.isCta ? ' nav-link--cta' : ''}${isActive ? ' active' : ''}`
                }
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
