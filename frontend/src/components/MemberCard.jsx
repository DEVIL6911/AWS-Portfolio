import { useScrollReveal } from '../hooks/useScrollReveal';

function getStickerIcon(sticker) {
  if (!sticker) return 'fa-solid fa-user';
  const s = sticker.toLowerCase();
  if (s.includes('president')) return 'fa-solid fa-crown';
  if (s.includes('faculty')) return 'fa-solid fa-user-tie';
  if (s.includes('founding')) return 'fa-solid fa-seedling';
  if (s.includes('team head') || s.includes('head')) return 'fa-solid fa-code';
  if (s.includes('co-lead')) return 'fa-solid fa-code';
  return 'fa-solid fa-user';
}

function getAchievementIcon(title) {
  if (!title) return 'fa-solid fa-seedling';
  const t = title.toLowerCase();
  if (t.includes('aws') || t.includes('certified') || t.includes('associate') || t.includes('practitioner')) return 'fa-solid fa-certificate';
  if (t.includes('hackathon') || t.includes('winner')) return 'fa-solid fa-medal';
  if (t.includes('mentor') || t.includes('student')) return 'fa-solid fa-chalkboard-user';
  if (t.includes('pipeline') || t.includes('ci/cd')) return 'fa-solid fa-code-branch';
  if (t.includes('workshop')) return 'fa-solid fa-flask';
  if (t.includes('launch') || t.includes('portal')) return 'fa-solid fa-rocket';
  if (t.includes('serverless')) return 'fa-solid fa-bolt';
  if (t.includes('built') || t.includes('created') || t.includes('defined') || t.includes('authored')) return 'fa-solid fa-seedling';
  if (t.includes('growth') || t.includes('reach')) return 'fa-solid fa-chart-line';
  if (t.includes('partnership') || t.includes('sponsorship')) return 'fa-solid fa-handshake';
  return 'fa-solid fa-seedling';
}

export default function MemberCard({ member, variant = 'default', showTeamLabel, teamLabel, showResponsibilities, responsibilitiesText }) {
  const ref = useScrollReveal();
  const isLeader = variant === 'leader';

  const cardClass = `member-card${isLeader ? ' member-card--leader' : ''}`;
  const stickerClass = `member-card__sticker${isLeader ? ' member-card__sticker--leader' : ''}`;
  const stickerIcon = getStickerIcon(member.sticker);

  return (
    <article className={cardClass} ref={ref} data-animate="">
      <div className="member-card__media">
        <img
          src={member.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=900&fit=crop&crop=face'}
          alt={member.name}
          loading="lazy"
        />
      </div>
      <div className="member-card__body">
        <h3 className="member-card__name">{member.name}</h3>
        <p className="member-card__title">{member.role}</p>
        <p className="member-card__bio">{member.bio}</p>

        {member.achievements && member.achievements.length > 0 && (
          <div className="member-card__block">
            <h4 className="member-card__heading">
              <i className="fa-solid fa-trophy"></i> Achievements
            </h4>
            <ul className="member-card__list">
              {member.achievements.map((ach, i) => (
                <li key={i}>
                  <i className={getAchievementIcon(ach.title)}></i> {ach.title}
                </li>
              ))}
            </ul>
          </div>
        )}

        {showResponsibilities && responsibilitiesText && (
          <div className="member-card__block">
            <h4 className="member-card__heading">
              <i className="fa-solid fa-layer-group"></i> Responsibilities
            </h4>
            <p className="member-card__text">{responsibilitiesText}</p>
          </div>
        )}

        {member.skills && member.skills.length > 0 && (
          <div className="member-card__skills">
            {member.skills.map((skill, i) => (
              <span className="skill-pill" key={i}>{skill.name}</span>
            ))}
          </div>
        )}

        <div className="member-card__social">
          {member.linkedin && (
            <a href={member.linkedin} aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
          )}
          {member.twitter && (
            <a href={member.twitter} aria-label="Twitter">
              <i className="fa-brands fa-twitter"></i>
            </a>
          )}
          {member.github && (
            <a href={member.github} aria-label="GitHub">
              <i className="fa-brands fa-github"></i>
            </a>
          )}
          {member.email && (
            <a href={`mailto:${member.email}`} aria-label="Email">
              <i className="fa-solid fa-envelope"></i>
            </a>
          )}
          {member.instagram && (
            <a href={member.instagram} aria-label="Instagram">
              <i className="fa-brands fa-instagram"></i>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
