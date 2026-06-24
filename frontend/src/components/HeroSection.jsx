const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg';

export default function HeroSection({ isPage = false, icon, label, title, description, actions }) {
  return (
    <header className={`hero${isPage ? ' hero--page' : ''}`} id="home">
      <div className="hero__glow hero__glow--1" style={{ zIndex: -5 }}></div>
      <div className="hero__glow hero__glow--2" style={{ zIndex: -5 }}></div>
      <div className="container hero__inner">
        <div className="hero__content">
          <span className="label-pill">
            {icon && <i className={icon}></i>} {label}
          </span>
          <h1 className="hero__title" dangerouslySetInnerHTML={{ __html: title }}></h1>
          <p className="hero__desc">{description}</p>
          {actions && <div className="hero__actions">{actions}</div>}
        </div>
        {!isPage && (
          <div className="hero__visual">
            <div className="hero__orb">
              <img
                src={logoUrl}
                alt=""
                className="hero__orb-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('hero__orb--fallback');
                }}
              />
              <i className="fa-solid fa-bolt hero__orb-icon"></i>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
