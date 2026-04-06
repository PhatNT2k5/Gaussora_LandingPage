"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimatedTetrahedron } from "./animated-tetrahedron";
import { useLanguage } from "@/lib/language-context";

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setIsVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: ((e.clientX - rect.left) / rect.width) * 100, y: ((e.clientY - rect.top) / rect.height) * 100 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("bb8:celebrate"));
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section id="contact" ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className={`relative border border-foreground transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} onMouseMove={handleMouseMove}>
          <div className="absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-300" style={{ background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(0,0,0,0.15), transparent 40%)` }} />
          <div className="relative z-10 px-8 lg:px-16 py-16 lg:py-24">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
              <div className="flex-1">
                <h2 className="text-3xl sm:text-4xl lg:text-7xl font-display tracking-tight mb-6 sm:mb-8 leading-[0.95]">
                  {t("contact.title1")}
                  <br />
                  {t("contact.title2")}
                </h2>
                <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-xl">{t("contact.description")}</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4 w-full max-w-md">
                  <input type="text" placeholder={t("contact.name")} className="h-12 px-4 rounded-full border border-foreground/20 bg-background hover:bg-background/80 transition-colors" required />
                  <input type="email" placeholder={t("contact.email")} className="h-12 px-4 rounded-full border border-foreground/20 bg-background hover:bg-background/80 transition-colors" required />
                  <input type="text" placeholder={t("contact.company")} className="h-12 px-4 rounded-full border border-foreground/20 bg-background hover:bg-background/80 transition-colors" required />
                  <textarea placeholder={t("contact.message")} rows={3} className="px-4 py-3 rounded-2xl border border-foreground/20 bg-background hover:bg-background/80 transition-colors resize-none" />
                  <Button type="submit" size="lg" className="bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base rounded-full group">
                    {isSubmitted ? t("contact.submitted") : t("contact.submit")}
                    {!isSubmitted && <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />}
                  </Button>
                </form>
                <p className="text-sm text-muted-foreground mt-6 font-mono">
                  {t("contact.directEmail")} hy@gaussora.com
                </p>
              </div>
              <div className="hidden lg:flex items-center justify-center w-[500px] h-[500px] xl:w-[640px] xl:h-[640px] 2xl:w-[720px] 2xl:h-[720px] -mr-20">
                <AnimatedTetrahedron />
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 border-b border-l border-foreground/10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-t border-r border-foreground/10" />
        </div>
      </div>
    </section>
  );
}
