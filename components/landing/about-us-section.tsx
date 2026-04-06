"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";

type AboutPoint = {
  number: string;
  title: string;
  description: string;
};

export function AboutUsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  const points: AboutPoint[] = [
    {
      number: "01",
      title: t("aboutUs.p1.title"),
      description: t("aboutUs.p1.desc"),
    },
    {
      number: "02",
      title: t("aboutUs.p2.title"),
      description: t("aboutUs.p2.desc"),
    },
    {
      number: "03",
      title: t("aboutUs.p3.title"),
      description: t("aboutUs.p3.desc"),
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about-us" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,currentColor_0,currentColor_1px,transparent_1px,transparent_88px)]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div
          className={`mb-16 lg:mb-24 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            {t("aboutUs.eyebrow")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-display tracking-tight leading-[0.95] mb-8 max-w-5xl">
            {t("aboutUs.title1")}
            <br />
            <span className="text-muted-foreground">{t("aboutUs.title2")}</span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-3xl">
            {t("aboutUs.description")}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {points.map((point, index) => (
            <article
              key={point.number}
              className={`border border-foreground/10 bg-background/50 backdrop-blur-sm p-6 lg:p-8 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 120}ms` }}
            >
              <p className="text-sm font-mono text-muted-foreground mb-6">{point.number}</p>
              <h3 className="text-2xl font-display mb-4">{point.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{point.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
