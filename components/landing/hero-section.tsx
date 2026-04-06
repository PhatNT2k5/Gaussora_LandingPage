"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { BB8Robot } from "./bb8-robot";
import { useLanguage } from "@/lib/language-context";
import { useIsMobile } from "@/hooks/use-mobile";

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* BB-8 3D Robot - centered background */}
      <div className="absolute inset-0 w-full h-full z-0">
        {isMobile ? (
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_40%,rgba(20,30,50,0.18),rgba(20,30,50,0.04)_45%,transparent_70%)]" />
        ) : (
          <BB8Robot />
        )}
      </div>
      
      {/* Subtle grid lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(8)].map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute h-px bg-foreground/10"
            style={{
              top: `${12.5 * (i + 1)}%`,
              left: 0,
              right: 0,
            }}
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute w-px bg-foreground/10"
            style={{
              left: `${8.33 * (i + 1)}%`,
              top: 0,
              bottom: 0,
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-32 lg:py-40 pointer-events-none">
        {/* Eyebrow */}
        <div 
          className={`mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
            <span className="w-8 h-px bg-foreground/30" />
            {t("hero.eyebrow")}
          </span>
        </div>
        
        {/* Main headline */}
        <div className="mb-12">
          <h1 
            className={`text-[clamp(2rem,10vw,10rem)] font-display leading-[0.9] tracking-tight transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <span className="block">{t("hero.headline1")}</span>
            <span className="block">
              {t("hero.headline2")}
              <span className="relative inline-block">
                <span className="inline-flex">
                  {t("hero.headline3").split("").map((char, i) => (
                    <span
                      key={i}
                      className="inline-block animate-char-in"
                      style={{
                        animationDelay: `${i * 50}ms`,
                      }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                <span className="absolute -bottom-2 left-0 right-0 h-3 bg-foreground/10" />
              </span>
            </span>
          </h1>
        </div>
        
        {/* Description and Contact Form */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-end">
          <p 
            className={`text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t("hero.description")}
          </p>
          
          {/* Contact Form */}
          <form 
            className={`flex flex-col gap-4 transition-all duration-700 delay-300 pointer-events-auto ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            onSubmit={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent("bb8:celebrate"));
              alert(t("hero.submitted"));
            }}
          >
            <input 
              type="text" 
              placeholder={t("hero.name")}
              className="h-12 px-4 rounded-full border border-foreground/20 bg-background hover:bg-background/80 transition-colors"
              required
            />
            <input 
              type="email" 
              placeholder={t("hero.email")}
              className="h-12 px-4 rounded-full border border-foreground/20 bg-background hover:bg-background/80 transition-colors"
              required
            />
            <input 
              type="text" 
              placeholder={t("hero.company")}
              className="h-12 px-4 rounded-full border border-foreground/20 bg-background hover:bg-background/80 transition-colors"
              required
            />
            <Button 
              type="submit"
              size="lg" 
              className="bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base rounded-full group"
            >
              {t("hero.submit")}
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </form>
        </div>
        
      </div>
    </section>
  );
}
