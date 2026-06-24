import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">
            <i className="fa-solid fa-cloud"></i>
          </span>
          <span>AWS Cloud Club</span>
        </div>
        <p className="footer__copy">
          &copy; 2026 AWS Cloud Club. All rights reserved. 
          {' | '}<Link to="/admin" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Admin Panel</Link>
        </p>
        <div className="footer__social">
          <a href="#" aria-label="GitHub">
            <i className="fa-brands fa-github"></i>
          </a>
          <a href="#" aria-label="LinkedIn">
            <i className="fa-brands fa-linkedin-in"></i>
          </a>
          <a href="#" aria-label="Instagram">
            <i className="fa-brands fa-instagram"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
