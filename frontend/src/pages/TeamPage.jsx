import { useState, useEffect } from 'react';
import { fetchMembersByTeam } from '../api/members';
import HeroSection from '../components/HeroSection';
import SectionHeader from '../components/SectionHeader';
import MemberCard from '../components/MemberCard';

const TEAM_CONFIG = {
  technical: {
    label: 'Technical Team',
    icon: 'fa-solid fa-code',
    heroTitle: 'Building the cloud stack that powers the club.',
    heroDesc: '1 Team Head and 4 Co-Leads driving workshops, infrastructure, serverless systems, and club project delivery.',
    headSectionLabel: 'Technical Team Head',
    headSectionTitle: 'Leading the technical roadmap',
    headSectionDesc: 'The core technical lead owns workshops, infrastructure, and club engineering standards.',
    coLeadsSectionLabel: 'Co-Leads',
    coLeadsSectionTitle: 'Technical team members',
    coLeadsSectionDesc: 'Four co-leads supporting cloud infrastructure, serverless systems, DevOps, and full-stack delivery.',
    teamLabel: 'Technical Team',
    headResponsibilities: 'Technical roadmap, workshop delivery, infra oversight, project architecture',
  },
  community: {
    label: 'Community Team',
    icon: 'fa-solid fa-users',
    heroTitle: 'Growing a thriving cloud community.',
    heroDesc: '1 Team Head and 3 Co-Leads building engagement programs, onboarding, and alumni networks.',
    headSectionLabel: 'Community Team Head',
    headSectionTitle: 'Leading community growth',
    headSectionDesc: 'The community lead designs engagement programs and nurtures club culture.',
    coLeadsSectionLabel: 'Co-Leads',
    coLeadsSectionTitle: 'Community team members',
    coLeadsSectionDesc: 'Three co-leads supporting onboarding, engagement, and alumni networking.',
    teamLabel: 'Community Team',
    headResponsibilities: 'Community strategy, engagement programs, onboarding, member experience',
  },
  'event-management': {
    label: 'Event Management Team',
    icon: 'fa-solid fa-calendar-days',
    heroTitle: 'Executing events that inspire the cloud community.',
    heroDesc: '1 Team Head and 3 Co-Leads planning and executing workshops, hackathons, and sessions.',
    headSectionLabel: 'Event Management Team Head',
    headSectionTitle: 'Leading event execution',
    headSectionDesc: 'The event management lead owns end-to-end event planning from concept to post-event analysis.',
    coLeadsSectionLabel: 'Co-Leads',
    coLeadsSectionTitle: 'Event management team members',
    coLeadsSectionDesc: 'Three co-leads supporting logistics, hackathons, and workshop delivery.',
    teamLabel: 'Event Management Team',
    headResponsibilities: 'Event planning, logistics, hackathon operations, workshop delivery',
  },
  'event-coordination': {
    label: 'Event Coordination Team',
    icon: 'fa-solid fa-diagram-project',
    heroTitle: 'Coordinating seamless event delivery across teams.',
    heroDesc: '1 Team Head and 2 Co-Leads managing cross-team workflows, timelines, and resources.',
    headSectionLabel: 'Event Coordination Team Head',
    headSectionTitle: 'Leading cross-team coordination',
    headSectionDesc: 'The coordination lead ensures every event runs on schedule with proper resource allocation.',
    coLeadsSectionLabel: 'Co-Leads',
    coLeadsSectionTitle: 'Event coordination team members',
    coLeadsSectionDesc: 'Two co-leads supporting scheduling, logistics, and resource management.',
    teamLabel: 'Event Coordination Team',
    headResponsibilities: 'Cross-team coordination, timeline management, resource allocation',
  },
  marketing: {
    label: 'Marketing Team',
    icon: 'fa-solid fa-hashtag',
    heroTitle: "Amplifying the club's impact through digital storytelling.",
    heroDesc: '1 Team Head and 4 Co-Leads driving brand strategy, content, social media, and visual design.',
    headSectionLabel: 'Marketing & Social Media Team Head',
    headSectionTitle: "Leading the club's digital presence",
    headSectionDesc: 'The marketing lead owns brand strategy, campaign planning, and the club\'s online identity.',
    coLeadsSectionLabel: 'Co-Leads',
    coLeadsSectionTitle: 'Marketing team members',
    coLeadsSectionDesc: 'Four co-leads supporting content strategy, social media, design, and video production.',
    teamLabel: 'Marketing Team',
    headResponsibilities: 'Brand strategy, social media management, content planning, campaign execution',
  },
};

export default function TeamPage({ teamKey }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const config = TEAM_CONFIG[teamKey];

  useEffect(() => {
    document.title = `${config.label} | AWS Cloud Club`;
    window.scrollTo(0, 0);
    setLoading(true);
    setError(null);
    fetchMembersByTeam(teamKey)
      .then(setMembers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [teamKey, config.label]);

  const teamHead = members.find((m) => m.role.toLowerCase().includes('head') && !m.role.toLowerCase().includes('co-lead'));
  const coLeads = members.filter((m) => m.role.toLowerCase().includes('co-lead'));

  if (loading) {
    return (
      <>
        <HeroSection isPage label={config.label} icon={config.icon} title={config.heroTitle} description={config.heroDesc} />
        <section className="section section--dark">
          <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '80px 24px' }}>
            <div className="label-pill">
              <i className="fa-solid fa-spinner fa-spin"></i> Loading team...
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeroSection isPage label={config.label} icon={config.icon} title={config.heroTitle} description={config.heroDesc} />
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
        label={config.label}
        icon={config.icon}
        title={config.heroTitle}
        description={config.heroDesc}
      />

      {/* Team Head */}
      {teamHead && (
        <section className="section section--dark">
          <div className="container">
            <SectionHeader
              label={config.headSectionLabel}
              title={config.headSectionTitle}
              description={config.headSectionDesc}
            />
            <div className="leader-featured">
              <MemberCard
                member={teamHead}
                variant="leader"
                teamLabel={config.teamLabel}
                showResponsibilities
                responsibilitiesText={config.headResponsibilities}
              />
            </div>
          </div>
        </section>
      )}

      {/* Co-Leads */}
      {coLeads.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeader
              isSubheader
              label={config.coLeadsSectionLabel}
              title={config.coLeadsSectionTitle}
              description={config.coLeadsSectionDesc}
            />
            <div className="members-grid">
              {coLeads.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  teamLabel={config.teamLabel}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
