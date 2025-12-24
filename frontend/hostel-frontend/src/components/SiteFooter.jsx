import { useState } from 'react';
import { Link } from 'react-router-dom';

const SiteFooter = () => {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__col">
          <h3 className="footer__title">My Services</h3>
          <ul className="footer__list">
            <li>
              <Link to="/student" className="footer__link">
                Student Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin" className="footer__link">
                Admin / Warden Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/rooms" className="footer__link">
                Room Management
              </Link>
            </li>
            <li>
              <Link to="/worker" className="footer__link">
                Worker Dashboard
              </Link>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h3 className="footer__title">Follow Us</h3>
          <ul className="footer__list">
            <li>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noreferrer"
                className="footer__link"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noreferrer"
                className="footer__link"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noreferrer"
                className="footer__link"
              >
                YouTube
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="footer__link"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__col footer__col--terms">
          <button
            type="button"
            className="footer__title footer__title--button"
            onClick={() => setShowTerms((prev) => !prev)}
            aria-expanded={showTerms}
          >
            Terms &amp; Conditions
            <span className="footer__chevron">{showTerms ? '\u25B2' : '\u25BC'}</span>
          </button>
          {showTerms && (
            <div className="footer__terms">
              <p>
                This hostel management system is designed for educational and internal use.
                Access is provided to registered students, staff, wardens, and administrators
                only.
              </p>
              <p>
                By logging in, you agree to use the system responsibly, keep your credentials
                confidential, and respect the privacy of other users.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="footer__bottom">
        <span>\u00a9 {new Date().getFullYear()} Hostel Management. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default SiteFooter;
