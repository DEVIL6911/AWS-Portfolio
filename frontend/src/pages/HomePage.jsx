import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllMembers } from '../api/members';
import HeroSection from '../components/HeroSection';
import SectionHeader from '../components/SectionHeader';
import MemberCard from '../components/MemberCard';

const TEAM_HEADS_CONFIG = [
  { teamKey: 'technical', route: '/technical-team', icon: 'fa-solid fa-code', label: 'Team Head' },
  { teamKey: 'community', route: '/community-team', icon: 'fa-solid fa-users', label: 'Team Head' },
  { teamKey: 'event-management', route: '/event-management', icon: 'fa-solid fa-calendar-days', label: 'Team Head' },
  { teamKey: 'event-coordination', route: '/event-coordination', icon: 'fa-solid fa-diagram-project', label: 'Team Head' },
  { teamKey: 'marketing', route: '/marketing-team', icon: 'fa-solid fa-hashtag', label: 'Team Head' },
];

export default function HomePage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'AWS Cloud Club | Team Showcase';
    fetchAllMembers()
      .then(setMembers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const leader = members.find((m) => m.team_key === 'leadership');
  const faculty = members.find((m) => m.team_key === 'faculty');

  // Get team heads (first member with "Head" in role for each team)
  const teamHeads = TEAM_HEADS_CONFIG.map((config) => {
    const head = members.find(
      (m) => m.team_key === config.teamKey && m.role.toLowerCase().includes('head')
    );
    return { ...config, member: head };
  }).filter((item) => item.member);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="label-pill">
          <i className="fa-solid fa-spinner fa-spin"></i> Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <div className="label-pill" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}>
          <i className="fa-solid fa-exclamation-triangle"></i> Error
        </div>
        <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Make sure the backend is running: <code>cd backend && python main.py</code>
        </p>
      </div>
    );
  }

  return (
    <>
      <HeroSection
        label="AWS Cloud Club"
        icon="fa-brands fa-aws"
        title='Build on the cloud.<br><span class="text-gradient">Lead the future.</span>'
        description="A next-gen community of builders, architects, and innovators shaping the cloud ecosystem — one deploy at a time."
        actions={
          <>
            <a href="#leadership" className="btn btn--primary">Meet Leadership</a>
            <a href="#core-team" className="btn btn--ghost">View Teams</a>
          </>
        }
      />

      {/* Leadership */}
      {leader && (
        <section className="section section--dark" id="leadership">
          <div className="container">
            <SectionHeader
              label="Leadership"
              title="President & AWS Student Builder Group Leader"
              description="Setting the vision, strategy, and direction for our cloud community."
            />
            <div className="leader-featured">
              <MemberCard
                member={leader}
                variant="leader"
                teamLabel="AWS Cloud Club"
                showResponsibilities
                responsibilitiesText="Club vision & strategy, AWS partnerships, executive oversight, mentorship programs, and representation at institutional level."
              />
            </div>
          </div>
        </section>
      )}

      {/* Faculty */}
      {faculty && (
        <section className="section" id="faculty">
          <div className="container">
            <SectionHeader
              label="Faculty Advisor"
              title="Guiding our cloud journey"
              description="Faculty mentorship and institutional support for the AWS Cloud Club."
            />
            <div className="members-stack">
              <MemberCard member={faculty} teamLabel="AWS Cloud Club" />
            </div>
          </div>
        </section>
      )}

      {/* Core Team */}
      {teamHeads.length > 0 && (
        <section className="section section--dark" id="core-team">
          <div className="container">
            <div className="team-subheader">
              <span className="label-pill">Core Team</span>
              <h2 className="section-title">Team heads leading each vertical</h2>
              <p className="section-desc">Five leads overseeing technical, community, events, coordination, and marketing operations.</p>
            </div>
            <div className="members-grid">
              {teamHeads.map(({ member, route }) => (
                <MemberCard key={member.id} member={member} teamLabel="AWS Cloud Club">
                  {/* The "View Team" button is injected via a wrapper below */}
                </MemberCard>
              ))}
            </div>
            {/* View Team buttons */}
            <style>{`
              .members-grid .member-card__body { position: relative; }
            `}</style>
          </div>
        </section>
      )}
    </>
  );
}
