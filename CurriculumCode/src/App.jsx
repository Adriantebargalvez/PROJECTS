import React from 'react';
import profilePhoto from './assets/adrian-profile.jpg';
import {
  contact,
  coverLetter,
  education,
  experience,
  extra,
  languages,
  profile,
  professionalLinks,
  skills,
  toolkit,
} from './cvData.js';

function SidebarSection({ title, children }) {
  return (
    <section className="sidebar-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function TextList({ items }) {
  return (
    <ul className="plain-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function MainSection({ title, children }) {
  return (
    <section className="main-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function ExternalArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function ContactIcon({ label }) {
  if (label === 'Email') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  if (label === 'Ubicación') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 10c0 5.5-8 11-8 11S4 15.5 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }

  if (label === 'LinkedIn') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1" />
        <path d="M14 11a5 5 0 0 0-7.1-.1l-2 2A5 5 0 0 0 12 20l1.1-1.1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 16.9v2.7a2 2 0 0 1-2.2 2 19.2 19.2 0 0 1-8.4-3 18.8 18.8 0 0 1-5.8-5.8 19.2 19.2 0 0 1-3-8.5A2 2 0 0 1 4.6 2h2.8a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.4 9.9a15.2 15.2 0 0 0 5.7 5.7l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2.3Z" />
    </svg>
  );
}

function App() {
  return (
    <>
      <a className="print-button" href="/documents/Adrian_Tebar_Galvez_CV.pdf" download>
        Descargar PDF
      </a>

      <main className="cv-page">
        <header className="cv-header">
          <div className="photo-frame">
            <img className="profile-photo" src={profilePhoto} alt="Adrián Tebar Gálvez" />
          </div>

          <div className="header-copy">
            <h1>Adrián Tebar Gálvez</h1>
            <p>Desarrollador de Software | Full Stack</p>
          </div>
        </header>

        <aside className="cv-sidebar">
          <SidebarSection title="Contacto">
            <ul className="contact-list">
              {contact.map(({ label, value, href }) => {
                const isExternal = href?.startsWith('http');

                return (
                  <li key={label}>
                    <ContactIcon label={label} />
                    <span className="sr-only">{label}</span>
                    {href ? (
                      <a
                        href={href}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noreferrer' : undefined}
                      >
                        {value}
                      </a>
                    ) : (
                      <strong>{value}</strong>
                    )}
                  </li>
                );
              })}
            </ul>
          </SidebarSection>

          <SidebarSection title="Habilidades">
            <TextList items={skills} />
          </SidebarSection>

          <SidebarSection title="Idiomas">
            <TextList items={languages} />
          </SidebarSection>

          <SidebarSection title="Otros datos">
            <TextList items={extra} />
          </SidebarSection>
        </aside>

        <section className="cv-content">
          <MainSection title="Perfil profesional">
            {profile.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </MainSection>

          <MainSection title="Experiencia profesional">
            <div className="timeline">
              {experience.map(({ period, role, company, details }) => (
                <article className="timeline-item" key={`${period}-${role}`}>
                  <div className="timeline-date">{period}</div>
                  <div className="timeline-body">
                    {company && <p className="company">{company}</p>}
                    <h3>{role}</h3>
                    <ul>
                      {details.map((detail) => (
                        <li key={detail}>{detail}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </MainSection>

          <MainSection title="Formación">
            <div className="education-list">
              {education.map(({ year, title }) => (
                <article className="education-item" key={`${year}-${title}`}>
                  <span>{year}</span>
                  <p>{title}</p>
                </article>
              ))}
            </div>
          </MainSection>
        </section>
      </main>

      <section className="letter-page">
        <div className="letter-header">
          <p>Carta de presentación</p>
          <h2>Adrián Tebar Gálvez</h2>
          <span>Desarrollador de Software | Full Stack</span>
        </div>

        <div className="letter-grid">
          <article className="letter-card letter-card-main">
            <h3>Carta de presentación</h3>
            {coverLetter.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </article>

          <aside className="letter-card">
            <h3>Lo que utilizo</h3>
            <div className="toolkit-grid">
              {toolkit.map(({ title, items }) => (
                <section className="toolkit-group" key={title}>
                  <h4>{title}</h4>
                  <ul>
                    {items.map((item) => (
                      <li key={item.name}>
                        <span className="tool-icon" style={{ '--tool-color': item.color }}>
                          {item.image && <img src={item.image} alt="" loading="lazy" />}
                          <span>{item.icon}</span>
                        </span>
                        <span className="tool-content">
                          <span className="tool-name">{item.name}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </aside>
        </div>

        <div className="links-panel">
          {professionalLinks.map(({ label, value, href }) => (
            <a href={href} target="_blank" rel="noreferrer" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <ExternalArrow />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

export default App;
