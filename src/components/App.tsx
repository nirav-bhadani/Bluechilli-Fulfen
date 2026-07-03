"use client";

import { useEffect } from "react";
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import Sections from "@/components/site/Sections";
import Footer from "@/components/site/Footer";
import Launcher from "@/components/assistant/Launcher";
import Chatbot from "@/components/assistant/Chatbot";
import SmoothScroll from "@/components/SmoothScroll";

export default function App() {
  // Reveal sections as they scroll into view.
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    // Only hide reveal elements once JS is confirmed running.
    document.documentElement.classList.add("reveal-ready");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <SmoothScroll />
      <Header />
      <main>
        <Hero />
        <Sections />
      </main>
      <Footer />
      <Launcher />
      <Chatbot />
    </>
  );
}
