"use client";

import { useState } from "react";
import {
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoPersonOutline,
  IoAccessibilityOutline,
} from "react-icons/io5";
import { copy, school } from "@/content/fulfen";

type FieldErrors = { name?: string; email?: string; message?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});

  const validate = (data: typeof form): FieldErrors => {
    const next: FieldErrors = {};
    if (!data.name.trim()) next.name = "Please enter your name.";
    if (!data.email.trim()) next.email = "Please enter your email address.";
    else if (!EMAIL_RE.test(data.email.trim()))
      next.email = "Please enter a valid email address.";
    if (!data.message.trim()) next.message = "Please enter a message.";
    else if (data.message.trim().length < 10)
      next.message = "Please give us a little more detail (at least 10 characters).";
    return next;
  };

  const update = (field: keyof typeof form, value: string) => {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);
    if (errors[field]) setErrors(validate(nextForm));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    const subject = encodeURIComponent(`Website enquiry from ${form.name || "a parent"}`);
    const body = encodeURIComponent(
      `${form.message}\n\nFrom: ${form.name}\nEmail: ${form.email}`,
    );
    window.location.href = `mailto:${school.email}?subject=${subject}&body=${body}`;
  };

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    school.mapQuery,
  )}&output=embed`;

  return (
    <section className="section" id="contact">
      <div className="shell">
        <div className="section-head center reveal">
          <p className="eyebrow">{copy.contact.eyebrow}</p>
          <h2 className="section-title">{copy.contact.title}</h2>
          <p className="section-body">{copy.contact.body}</p>
        </div>

        <div className="contact-grid reveal">
          {/* Left: details + map */}
          <div className="contact-info">
            <div className="contact-details">
              <h3>{school.name}</h3>
              <ul className="contact-lines">
                <li>
                  <IoLocationOutline />
                  <span>{school.addressLines.join(", ")}</span>
                </li>
                <li>
                  <IoPersonOutline />
                  <span>Main Contact: {school.contactName}</span>
                </li>
                <li>
                  <IoCallOutline />
                  <a href={`tel:${school.phone.replace(/\s/g, "")}`}>{school.phone}</a>
                </li>
                <li>
                  <IoMailOutline />
                  <a href={`mailto:${school.email}`}>{school.email}</a>
                </li>
                <li>
                  <IoAccessibilityOutline />
                  <span>SEN Contact: {school.senContact}</span>
                </li>
                <li>
                  <IoMailOutline />
                  <a href={`mailto:${school.senEmail}`}>{school.senEmail}</a>
                </li>
              </ul>
            </div>

            <div className="contact-map">
              <iframe
                title={`Map to ${school.name}`}
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right: form */}
          <form className="contact-form" onSubmit={submit} noValidate>
            <h3>Send us a message</h3>
            <label>
              <span>Your name</span>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Jane Smith"
                aria-invalid={!!errors.name}
                className={errors.name ? "invalid" : ""}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>
            <label>
              <span>Email address</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                className={errors.email ? "invalid" : ""}
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </label>
            <label>
              <span>Message</span>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="I'd love to arrange a visit for my child…"
                aria-invalid={!!errors.message}
                className={errors.message ? "invalid" : ""}
              />
              {errors.message && <span className="field-error">{errors.message}</span>}
            </label>
            <button type="submit" className="btn btn-primary">
              Send message
            </button>
            <p className="contact-form-note">
              This opens your email app addressed to the school office. Prefer to
              call? Ring us on {school.phone}.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
