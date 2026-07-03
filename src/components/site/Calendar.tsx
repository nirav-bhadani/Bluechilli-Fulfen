import { IoTimeOutline, IoArrowForward, IoCalendarClearOutline } from "react-icons/io5";
import { calendarEvents, calendarUrl, copy, school } from "@/content/fulfen";

const CAL_COLORS = [
  "#f6b93b",
  "#e8604c",
  "#5fa668",
  "#2b5cad",
  "#2f9aa6",
  "#c9578f",
  "#7a5fa6",
  "#0407a5",
  "#e2712b",
];

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function Calendar() {
  return (
    <section className="section section-alt" id="calendar">
      <div className="shell">
        <div className="cal-head reveal">
          <div>
            <p className="eyebrow">{copy.calendar.eyebrow}</p>
            <h2 className="section-title">{copy.calendar.title}</h2>
            <p className="section-body">{copy.calendar.body}</p>
          </div>
          <a
            className="btn btn-ghost cal-head-cta"
            href={calendarUrl}
            target="_blank"
            rel="noreferrer"
          >
            <IoCalendarClearOutline /> Full calendar
          </a>
        </div>

        <div className="cal-grid reveal">
          {calendarEvents.map((e, i) => {
            const color = CAL_COLORS[i % CAL_COLORS.length];
            return (
              <a
                className="cal-card"
                key={`${e.title}-${e.day}-${i}`}
                href={school.website + e.link}
                target="_blank"
                rel="noreferrer"
                style={
                  {
                    "--ev-color": color,
                    "--ev-soft": hexToRgba(color, 0.12),
                  } as React.CSSProperties
                }
              >
                <div className="cal-date">
                  <span className="cal-date-day">{e.day}</span>
                  <span className="cal-date-month">{e.month}</span>
                </div>
                <div className="cal-card-body">
                  <h4>{e.title}</h4>
                  <p className="cal-card-meta">
                    <IoTimeOutline /> {e.time}
                  </p>
                </div>
                <span className="cal-card-go" aria-hidden="true">
                  <IoArrowForward />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
