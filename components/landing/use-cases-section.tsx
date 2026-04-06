"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/language-context";

export function UseCasesSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const useCases = [
    {
      number: "I",
      title: t("useCases.uc1.title"),
      description: t("useCases.uc1.desc"),
      code: `import { gaussora } from '@gaussora/contracts'

const analysis = await gaussora.analyze({
  documents: contractFiles,
  extract: ['clauses', 'risks', 'dates'],
  language: 'vi'
})

// ✓ 500 contracts analyzed in 3 min`,
    },
    {
      number: "II",
      title: t("useCases.uc2.title"),
      description: t("useCases.uc2.desc"),
      code: `const forecast = await gaussora.predict({
  data: marketData,
  model: 'time-series',
  horizon: '6 months',
  confidence: 0.95
})

// Accuracy: 94.7%`,
    },
    {
      number: "III",
      title: t("useCases.uc3.title"),
      description: t("useCases.uc3.desc"),
      code: `const insights = await gaussora.marketing({
  audience: customerData,
  channels: ['social', 'email', 'ads'],
  optimize: 'conversion'
})

// ROI +340% after 3 months`,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => { setActiveStep((prev) => (prev + 1) % useCases.length); }, 5000);
    return () => clearInterval(interval);
  }, [useCases.length]);

  return (
    <section id="use-cases" ref={sectionRef} className="relative py-16 sm:py-24 lg:py-32 bg-foreground text-background overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 40px, currentColor 40px, currentColor 41px)` }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-mono text-background/50 mb-6">
            <span className="w-8 h-px bg-background/30" />
            {t("useCases.eyebrow")}
          </span>
          <h2 className={`text-3xl sm:text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            {t("useCases.title1")}
            <br />
            <span className="text-background/50">{t("useCases.title2")}</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div className="space-y-0">
            {useCases.map((step, index) => (
              <button key={step.number} type="button" onClick={() => setActiveStep(index)}
                className={`w-full text-left py-8 border-b border-background/10 transition-all duration-500 group ${activeStep === index ? "opacity-100" : "opacity-40 hover:opacity-70"}`}>
                <div className="flex items-start gap-6">
                  <span className="font-display text-3xl text-background/30">{step.number}</span>
                  <div className="flex-1">
                    <h3 className="text-2xl lg:text-3xl font-display mb-3 group-hover:translate-x-2 transition-transform duration-300">{step.title}</h3>
                    <p className="text-background/60 leading-relaxed">{step.description}</p>
                    {activeStep === index && (
                      <div className="mt-4 h-px bg-background/20 overflow-hidden">
                        <div className="h-full bg-background w-0" style={{ animation: 'progress 5s linear forwards' }} />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:sticky lg:top-32 self-start">
            <div className="border border-background/10 overflow-hidden">
              <div className="px-6 py-4 border-b border-background/10 flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                  <div className="w-3 h-3 rounded-full bg-background/20" />
                </div>
                <span className="text-xs font-mono text-background/40">use-case.ts</span>
              </div>
              <div className="p-6 sm:p-8 font-mono text-xs sm:text-sm min-h-[240px] sm:min-h-[280px] overflow-x-auto">
                <pre className="text-background/70">
                  {useCases[activeStep].code.split('\n').map((line, lineIndex) => (
                    <div key={`${activeStep}-${lineIndex}`} className="leading-loose code-line-reveal" style={{ animationDelay: `${lineIndex * 100}ms` }}>
                      <span className="text-background/20 select-none w-6 sm:w-8 inline-block">{lineIndex + 1}</span>
                      <span>{line}</span>
                    </div>
                  ))}
                </pre>
              </div>
              <div className="px-6 py-4 border-t border-background/10 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs font-mono text-background/40">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress { from { width: 0%; } to { width: 100%; } }
        .code-line-reveal { opacity: 0; transform: translateX(-8px); animation: lineReveal 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes lineReveal { to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </section>
  );
}
