"use client";
import {useEffect} from "react";

const TARGETS = ".cl-hero>*,.cl-demo,.cl-stats article,.cl-feature>*,.ed-heading,.ed-steps article,.ed-connection-guide,.ed-calendar-section>*,.ed-channels>*,.ed-channel-list article,.ed-pricing-heading,.ed-pricing-switcher,.ed-price-card,.ed-pricing-comparison,.ed-faq>*,.cl-founder-card,.cl-platform-grid article,.cl-platforms-section .ed-heading,.ed-final,.ed-footer";

export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(TARGETS));
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("rv-in"); io.unobserve(e.target); }
    }), {threshold: 0.12, rootMargin: "0px 0px -6% 0px"});
    els.forEach((el) => {
      const siblings = el.parentElement ? Array.from(el.parentElement.children).filter((c) => c.classList.contains("rv") || els.includes(c as HTMLElement)) : [];
      el.style.setProperty("--rv-delay", `${Math.max(0, siblings.indexOf(el)) * 0.09}s`);
      el.classList.add("rv");
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return null;
}
