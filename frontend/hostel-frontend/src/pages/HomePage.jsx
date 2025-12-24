import { Link, useNavigate } from 'react-router-dom';
import SiteFooter from '../components/SiteFooter.jsx';

const HomePage = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="landing">
      {/* Navbar */}
      <header className="landing__nav">
        <div className="landing__brand">Hostel Management</div>
        <nav className="landing__nav-links">
          <button
            type="button"
            className="landing__nav-link"
            onClick={() => navigate('/admin/rooms')}
          >
            Rooms
          </button>
          <button
            type="button"
            className="landing__nav-link"
            onClick={() => navigate('/student')}
          >
            Cleanliness
          </button>
          <button
            type="button"
            className="landing__nav-link"
            onClick={() => navigate('/student')}
          >
            Food
          </button>
        </nav>
        <div className="landing__auth-actions">
          <Link to="/login" className="btn btn--secondary">
            Login
          </Link>
          <Link to="/register" className="btn btn--primary">
            Register
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="landing-hero">
          <div className="landing-hero__content">
            <h1>Welcome to Your Smart Hostel Management System</h1>
            <p>
              Manage rooms, track complaints, monitor cleanliness, and ensure quality food service
              in one modern dashboard for students, wardens, and staff.
            </p>
            <div className="landing-hero__actions">
              <Link to="/login" className="btn btn--primary">
                Get Started
              </Link>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => scrollToSection('overview-section')}
              >
                Learn more
              </button>
            </div>
          </div>

          <div className="landing-hero__image">
            {/* Replace src with your own hostel image if you have one */}
            <img
              src="https://images.pexels.com/photos/396547/pexels-photo-396547.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Hostel building exterior"
            />
          </div>
        </section>

        {/* Overview cards */}
        <section id="overview-section" className="landing-section">
          <h2>Everything in one place</h2>
          <p className="landing-section__subtitle">
            A quick overview of rooms, cleanliness, food, and student life in your hostel.
          </p>

          <div className="landing-grid">
            <article
              className="landing-card"
              onClick={() => navigate('/admin/rooms')}
            >
              <div className="landing-card__image">
                <img
                  src="https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Hostel rooms corridor"
                />
              </div>
              <div className="landing-card__body">
                <h3>Rooms</h3>
                <p>
                  View room capacity, occupancy, and types at a glance. Easily manage allocations
                  for students.
                </p>
              </div>
            </article>

            <article
              className="landing-card"
              onClick={() => navigate('/student')}
            >
              <div className="landing-card__image">
                <img
                  src="https://images.pexels.com/photos/4099467/pexels-photo-4099467.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Cleaning staff in corridor"
                />
              </div>
              <div className="landing-card__body">
                <h3>Cleanliness</h3>
                <p>
                  Track complaints on cleaning, assign workers, and maintain a clean and safe
                  environment.
                </p>
              </div>
            </article>

            <article
              className="landing-card"
              onClick={() => navigate('/student')}
            >
              <div className="landing-card__image">
                <img
                  src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Hostel food in cafeteria"
                />
              </div>
              <div className="landing-card__body">
                <h3>Food</h3>
                <p>
                  Ensure quality meals with feedback and complaints integrated directly into your
                  system.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* Detailed sections */}
        <section id="rooms-section" className="landing-section landing-section--alt">
          <div className="landing-section__content">
            <div className="landing-section__text">
              <h2>Room Management</h2>
              <p>
                Get a complete view of every room in the hostel, including capacity, floor,
                and current occupancy. Admins and wardens can quickly add new rooms or update
                existing ones.
              </p>
              <p>
                Once logged in, go to the Admin Dashboard and open <strong>Manage Rooms</strong> to
                work with the live data.
              </p>
            </div>
            <div className="landing-section__image">
              <img
                src="https://images.pexels.com/photos/3209035/pexels-photo-3209035.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Students room with beds and desks"
              />
            </div>
          </div>
        </section>

        <section id="cleanliness-section" className="landing-section">
          <div className="landing-section__content">
            <div className="landing-section__image">
              <img
                src="https://images.pexels.com/photos/4099466/pexels-photo-4099466.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Cleaner wiping surface"
              />
            </div>
            <div className="landing-section__text">
              <h2>Cleanliness & Complaints</h2>
              <p>
                Students can raise complaints about cleanliness directly from their dashboard.
                Wardens and admins can track status and assign workers to resolve issues.
              </p>
            </div>
          </div>
        </section>

        <section id="food-section" className="landing-section landing-section--alt">
          <div className="landing-section__content">
            <div className="landing-section__text">
              <h2>Food & Dining</h2>
              <p>
                Communicate daily menus, collect feedback, and log complaints to keep the dining
                experience consistent and hygienic for everyone.
              </p>
            </div>
            <div className="landing-section__image">
              <img
                src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Buffet food in hostel cafeteria"
              />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default HomePage;
