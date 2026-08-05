import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProjectsSection from '../components/ProjectsSection';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="card">
        <h2>Welcome to ECOSA Online</h2>

        <p>
          Equatorial College Old Students Association — your alumni hub for
          registration, projects, payments and networking.
        </p>

        <ul>
          <li>
            <strong>Register as an alumnus:</strong> Submit your details and
            join the ECOSA members list automatically.
          </li>

          <li>
            <strong>Pay membership fees:</strong> Complete membership payments
            and get added to the members registry.
          </li>

          <li>
            <strong>View community announcements:</strong> Receive official
            ECOSA updates in a read-only feed.
          </li>

          <li>
            <strong>See current projects:</strong> Explore featured initiatives
            and contribute or donate with one click.
          </li>
        </ul>

        <div
          style={{
            marginTop: 12,
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <Link className="btn" to="/register">
            Register
          </Link>

          <Link className="btn" to="/payments">
            Pay Membership (UGX 20,000)
          </Link>

          <Link className="btn" to="/community">
            Community
          </Link>

          <Link className="btn" to="/members">
            Members Search
          </Link>

          <Link className="btn" to="/projects">
    Projects
  </Link>
        </div>
      </div>

      <ProjectsSection
        onContribute={() =>
          navigate('/payments?purpose=Project+Donation')
        }
        onDonate={() =>
          navigate('/payments?purpose=Project+Donation')
        }
      />
    </>
  );
};

export default Home;
