import {
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { nav, school } from "@/content/fulfen";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-brand-row">
              <img src={school.logo} alt={school.name} />
              <span className="brand-name">{school.name}</span>
            </div>
            <p className="footer-motto">{school.motto}</p>
          </div>

          <div className="footer-contact">
            <h4>Contact us at</h4>
            <p className="footer-contact-name">{school.name}</p>
            <ul className="footer-lines">
              <li>
                <IoPersonOutline /> Main Contact: {school.contactName}
              </li>
              <li>
                <IoLocationOutline /> {school.addressLines.join(", ")}
              </li>
              <li>
                <IoCallOutline />
                <a href={`tel:${school.phone.replace(/\s/g, "")}`}>{school.phone}</a>
              </li>
              <li>
                <IoMailOutline />
                <a href={`mailto:${school.email}`}>{school.email}</a>
              </li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4>Explore</h4>
            <nav aria-label="Footer">
              {nav.map((n) => (
                <a key={n.href} href={n.href}>
                  {n.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="footer-base">
          <span>
            © {year} {school.name}. All Rights Reserved.
          </span>
          <span className="footer-credit">
            Design by{" "}
            <a href="https://bluechilli.agency/" target="_blank" rel="noreferrer">
              Bluechilli
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
