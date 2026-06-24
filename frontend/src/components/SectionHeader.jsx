export default function SectionHeader({ label, title, description, isSubheader = false }) {
  const wrapperClass = isSubheader ? 'team-subheader' : 'section-header';

  return (
    <div className={wrapperClass}>
      <span className="label-pill">{label}</span>
      <h2 className="section-title">{title}</h2>
      <p className="section-desc">{description}</p>
    </div>
  );
}
