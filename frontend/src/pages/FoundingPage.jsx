import { useState, useEffect } from 'react';
import { fetchMembersByTeam } from '../api/members';
import HeroSection from '../components/HeroSection';
import SectionHeader from '../components/SectionHeader';
import MemberCard from '../components/MemberCard';

export default function FoundingPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = 'Founding Members | AWS Cloud Club';
    window.scrollTo(0, 0);
    fetchMembersByTeam('founding')
      .then(setMembers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <HeroSection
          isPage
          label="Founding Members"
          icon="fa-solid fa-seedling"
          title="The pioneers who started it all."
          description="10 founding members laid the foundation for the AWS Cloud Club and built the initial community, workshops, and identity."
        />
        <section className="section section--dark">
          <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '80px 24px' }}>
            <div className="label-pill">
              <i className="fa-solid fa-spinner fa-spin"></i> Loading founders...
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeroSection
          isPage
          label="Founding Members"
          icon="fa-solid fa-seedling"
          title="The pioneers who started it all."
          description="10 founding members laid the foundation for the AWS Cloud Club and built the initial community, workshops, and identity."
        />
        <section className="section section--dark">
          <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 24px', gap: '16px' }}>
            <div className="label-pill" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}>
              <i className="fa-solid fa-exclamation-triangle"></i> Error
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <HeroSection
        isPage
        label="Founding Members"
        icon="fa-solid fa-seedling"
        title="The pioneers who started it all."
        description="10 founding members laid the foundation for the AWS Cloud Club and built the initial community, workshops, and identity."
      />

      <section className="section section--dark">
        <div className="container">
          <SectionHeader
            label="Founding Member Badge"
            title="Original members of the club"
            description="Compact premium cards that can scale easily as the founding roster grows."
          />
          <div className="members-grid members-grid--founding">
            {members.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                teamLabel="AWS Cloud Club"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
