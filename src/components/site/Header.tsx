"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoMenuOutline, IoCloseOutline, IoArrowForward } from "react-icons/io5";
import { useExperienceStore } from "@/store/useExperienceStore";
import { nav, school, values } from "@/content/fulfen";
import { lockScroll, unlockScroll } from "@/components/scrollLock";

export default function Header() {
  const toggleChat = useExperienceStore((s) => s.toggleChat);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", menuOpen);
    document.body.classList.toggle("menu-open", menuOpen);

    if (!menuOpen) {
      unlockScroll();
      return () => {
        document.documentElement.classList.remove("menu-open");
        document.body.classList.remove("menu-open");
      };
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    window.addEventListener("keydown", onKey);
    lockScroll();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("menu-open");
      document.body.classList.remove("menu-open");
      unlockScroll();
    };
  }, [menuOpen]);

  const openChat = () => {
    setMenuOpen(false);
    toggleChat(true);
  };

  return (
    <header
      className={`site-header ${scrolled ? "scrolled" : ""} ${
        menuOpen ? "menu-open" : ""
      }`}
    >
      <div className="shell header-inner">
        <a className="brand" href="#top" aria-label={school.name}>
          <img className="brand-logo" src={school.logo} alt={school.name} />
          <span>
            <span className="brand-name">{school.name}</span>
            <br />
            <span className="brand-sub">
              {values.map((v) => v.title).join(" · ")}
            </span>
          </span>
        </a>

        <nav className="nav" aria-label="Primary">
          {nav.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => toggleChat(true)}>
            Ask Fulfen
          </button>
          <a className="btn btn-primary" href="#contact">
            Arrange a Visit
          </a>
          <button
            className="nav-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <IoCloseOutline /> : <IoMenuOutline />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className="mobile-menu"
              aria-label="Mobile"
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <ul className="mobile-menu-links">
                {nav.map((n, i) => (
                  <motion.li
                    key={n.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i + 0.05 }}
                  >
                    <a href={n.href} onClick={() => setMenuOpen(false)}>
                      <span>{n.label}</span>
                      <IoArrowForward />
                    </a>
                  </motion.li>
                ))}
              </ul>
              <div className="mobile-menu-actions">
                <button className="btn btn-ghost" onClick={openChat}>
                  Ask Fulfen
                </button>
                <a
                  className="btn btn-primary"
                  href="#contact"
                  onClick={() => setMenuOpen(false)}
                >
                  Arrange a Visit
                </a>
              </div>
              <p className="mobile-menu-foot">
                {school.name}
                <br />
                {school.phone}
              </p>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
