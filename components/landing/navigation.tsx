"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const emitNavigate = (target: string) => {
    window.dispatchEvent(new CustomEvent("bb8:navigate", { detail: { target } }));
  };

  const navLinks = [
    { name: t("nav.services"), href: "#features" },
    { name: t("nav.useCases"), href: "#use-cases" },
    { name: t("nav.whyUs"), href: "#why-us" },
    { name: t("nav.aboutUs"), href: "#about-us" },
    { name: t("nav.contact"), href: "#contact" },
  ];

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const nextIsScrolled = window.scrollY > 20;
        setIsScrolled((prev) => (prev === nextIsScrolled ? prev : nextIsScrolled));
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled 
          ? "top-4 left-4 right-4" 
          : "top-0 left-0 right-0"
      }`}
    >
      <nav 
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"
        }`}
      >
        <div 
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          {/* Logo */}
          <a href="#hero" onClick={() => emitNavigate("#hero")} className="flex items-center gap-2 group">
            <span className={`font-display tracking-tight transition-all duration-500 italic ${isScrolled ? "text-xl" : "text-2xl"}`}>Gaussora</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => emitNavigate(link.href)}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang("vi")}
                className={`text-sm transition-colors ${lang === "vi" ? "text-foreground font-medium" : "text-foreground/50 hover:text-foreground/70"}`}
              >
                VI
              </button>
              <span className="text-foreground/20">/</span>
              <button
                onClick={() => setLang("en")}
                className={`text-sm transition-colors ${lang === "en" ? "text-foreground font-medium" : "text-foreground/50 hover:text-foreground/70"}`}
              >
                EN
              </button>
            </div>
            <Button
              size="sm"
              className={`bg-foreground hover:bg-foreground/90 text-background rounded-full transition-all duration-500 ${isScrolled ? "px-4 h-8 text-xs" : "px-6"}`}
              asChild
            >
              <a href="#contact" onClick={() => emitNavigate("#contact")}>{t("nav.contact")}</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

      </nav>
      
      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-background z-40 transition-all duration-500 ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: 0 }}
      >
        <div className="flex flex-col h-full px-8 pt-28 pb-8">
          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center gap-8">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  emitNavigate(link.href);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 ${
                  isMobileMenuOpen 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}
              >
                {link.name}
              </a>
            ))}
          </div>
          
          {/* Bottom CTA */}
          <div className={`flex flex-col gap-4 pt-8 border-t border-foreground/10 transition-all duration-500 ${
            isMobileMenuOpen 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            {/* Language toggle mobile */}
            <div className="flex items-center justify-center gap-4 mb-2">
              <button
                onClick={() => setLang("vi")}
                className={`text-base transition-colors ${lang === "vi" ? "text-foreground font-medium" : "text-foreground/50"}`}
              >
                Tiếng Việt
              </button>
              <span className="text-foreground/20">|</span>
              <button
                onClick={() => setLang("en")}
                className={`text-base transition-colors ${lang === "en" ? "text-foreground font-medium" : "text-foreground/50"}`}
              >
                English
              </button>
            </div>
            <Button 
              className="flex-1 bg-foreground text-background rounded-full h-14 text-base"
              onClick={() => setIsMobileMenuOpen(false)}
              asChild
            >
              <a
                href="#contact"
                onClick={() => {
                  emitNavigate("#contact");
                }}
              >
                {t("nav.contactNow")}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
