"use client";

import type { IconType } from "react-icons";
import {
  IoBalloonOutline,
  IoStarOutline,
  IoBookOutline,
  IoCalculatorOutline,
  IoFlaskOutline,
  IoColorPaletteOutline,
  IoMusicalNotesOutline,
  IoRocketOutline,
} from "react-icons/io5";
import {
  awards,
  copy,
  journey,
  school,
  schoolLife,
  values,
} from "@/content/fulfen";
import Calendar from "./Calendar";
import Contact from "./Contact";

const JOURNEY_ICONS: Record<string, IconType> = {
  play: IoBalloonOutline,
  star: IoStarOutline,
  book: IoBookOutline,
  maths: IoCalculatorOutline,
  science: IoFlaskOutline,
  art: IoColorPaletteOutline,
  music: IoMusicalNotesOutline,
  rocket: IoRocketOutline,
};

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function Sections() {
  return (
    <>
      {/* About */}
      <section className="section" id="about">
        <div className="shell about-grid reveal">
          <div className="about-media">
            <div className="about-photo">
              <img src={school.aboutImage} alt={`Children reading at ${school.name}`} />
            </div>
            <div className="about-head-card">
              <img src={school.headteacherPhoto} alt={school.headteacher} />
              <span>
                <strong>{school.headteacher}</strong>
                <span>Headteacher</span>
              </span>
            </div>
          </div>
          <div>
            <p className="eyebrow">{copy.about.eyebrow}</p>
            <p className="about-quote">{copy.about.title}</p>
            <p className="about-body">{copy.about.body}</p>
            <p className="about-signoff">{copy.about.signoff}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section-alt" id="values">
        <div className="shell">
          <div className="section-head center reveal">
            <p className="eyebrow">{copy.values.eyebrow}</p>
            <h2 className="section-title">{copy.values.title}</h2>
            <p className="section-body">{copy.values.body}</p>
          </div>
          <div className="values-grid reveal">
            {values.map((v) => (
              <div className="value-tile" key={v.key}>
                <div className="value-letter" style={{ background: v.color }}>
                  {v.letter}
                </div>
                <h3>{v.title}</h3>
                <p>{v.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum journey */}
      <section className="section" id="curriculum">
        <div className="shell">
          <div className="section-head reveal">
            <p className="eyebrow">{copy.curriculum.eyebrow}</p>
            <h2 className="section-title">{copy.curriculum.title}</h2>
            <p className="section-body">{copy.curriculum.body}</p>
          </div>
          <div className="journey-rail reveal">
            {journey.map((j, i) => {
              const Icon = JOURNEY_ICONS[j.icon] ?? IoStarOutline;
              return (
                <div
                  className="journey-stop"
                  key={j.key}
                  style={
                    {
                      "--stop-color": j.color,
                      "--stop-soft": hexToRgba(j.color, 0.12),
                    } as React.CSSProperties
                  }
                >
                  <span className="journey-step">
                    Step {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="journey-ic">
                    <Icon />
                  </span>
                  <h4>{j.label}</h4>
                  <p>{j.theme}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* School life */}
      <section className="section section-alt" id="life">
        <div className="shell">
          <div className="section-head reveal">
            <p className="eyebrow">{copy.life.eyebrow}</p>
            <h2 className="section-title">{copy.life.title}</h2>
            <p className="section-body">{copy.life.body}</p>
          </div>
          <div className="life-grid reveal">
            {schoolLife.map((s) => (
              <div className="life-card" key={s.title}>
                <img src={s.img} alt={s.title} loading="lazy" />
                <div className="life-card-body">
                  <h4>{s.title}</h4>
                  <p>{s.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="section" id="achievements">
        <div className="shell">
          <div className="section-head center reveal">
            <p className="eyebrow">{copy.achievements.eyebrow}</p>
            <h2 className="section-title">{copy.achievements.title}</h2>
            <p className="section-body">{copy.achievements.body}</p>
          </div>
          <div className="awards-grid reveal">
            {awards.map((a) => (
              <div className="award-tile" key={a.title}>
                <div className="award-badge">
                  <img src={a.img} alt={a.title} loading="lazy" />
                </div>
                <h4>{a.title}</h4>
                <p>{a.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Calendar */}
      <Calendar />

      {/* Contact — map + form + details */}
      <Contact />
    </>
  );
}
