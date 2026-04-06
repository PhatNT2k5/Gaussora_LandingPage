"use client";

import { useEffect, useState, useRef } from "react";
import { Target, Settings, DollarSign } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function WhyChooseUsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useLanguage();

  const reasons = [
    { icon: Target, title: t("whyUs.r1.title"), description: t("whyUs.r1.desc") },
    { icon: Settings, title: t("whyUs.r2.title"), description: t("whyUs.r2.desc") },
    { icon: DollarSign, title: t("whyUs.r3.title"), description: t("whyUs.r3.desc") },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="why-us" ref={sectionRef} className="relative py-24 lg:py-32 bg-foreground/[0.02] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              {t("whyUs.eyebrow")}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-display tracking-tight mb-8">
              {t("whyUs.title1")}
              <br />
              {t("whyUs.title2")}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              {t("whyUs.description")}
            </p>
          </div>
          <div className="grid gap-6">
            {reasons.map((reason, index) => (
              <div key={reason.title}
                className={`p-6 border border-foreground/10 hover:border-foreground/20 transition-all duration-500 group ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
                style={{ transitionDelay: `${index * 100}ms` }}>
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 flex items-center justify-center border border-foreground/10 group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                    <reason.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-1 group-hover:translate-x-1 transition-transform duration-300">{reason.title}</h3>
                    <p className="text-muted-foreground">{reason.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
