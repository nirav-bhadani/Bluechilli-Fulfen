"use client";

import { motion, type Variants } from "framer-motion";
import { IoArrowForward, IoSparkles } from "react-icons/io5";
import { copy, facts, school } from "@/content/fulfen";
import HeroChat from "@/components/assistant/HeroChat";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="shell hero-grid">
        <motion.div
          className="hero-copy"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.span className="hero-pill" variants={item}>
            <IoSparkles /> {copy.hero.eyebrow}
          </motion.span>

          <motion.h1 className="hero-title" variants={item}>
            {copy.hero.title}{" "}
            <span className="hl">{copy.hero.titleAccent}</span>
          </motion.h1>

          <motion.p className="hero-sub" variants={item}>
            {copy.hero.subtitle}
          </motion.p>

          <motion.div className="hero-cta" variants={item}>
            <a className="btn btn-primary" href="#contact">
              {copy.hero.primaryCta} <IoArrowForward />
            </a>
          </motion.div>

          <motion.div className="hero-facts" variants={item}>
            {facts.map((f) => (
              <div className="hero-fact" key={f.label}>
                <div className="hero-fact-value">{f.value}</div>
                <div className="hero-fact-label">{f.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
        >
          <HeroChat />
        </motion.div>
      </div>
      <span className="sr-content">
        Call {school.name} on {school.phone}.
      </span>
    </section>
  );
}
