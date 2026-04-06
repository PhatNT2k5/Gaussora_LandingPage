"use client";

import { ArrowUpRight } from "lucide-react";
import { AnimatedWave } from "./animated-wave";
import { useLanguage } from "@/lib/language-context";
import { useIsMobile } from "@/hooks/use-mobile";

export function FooterSection() {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  const footerLinks = {
    [t("footer.services")]: [
      { name: "AI Automation", href: "#features" },
      { name: "Data Intelligence", href: "#features" },
      { name: "Custom AI Agent", href: "#features" },
    ],
    [t("footer.useCases")]: [
      { name: t("footer.contractAnalysis"), href: "#use-cases" },
      { name: t("footer.marketForecast"), href: "#use-cases" },
      { name: t("footer.marketingSupport"), href: "#use-cases" },
    ],
    [t("footer.company")]: [
      { name: t("footer.aboutUs"), href: "#about-us" },
      { name: t("footer.contact"), href: "#contact" },
    ],
  };

  const socialLinks = [
    { name: "LinkedIn", href: "#" },
    { name: "Facebook", href: "#" },
  ];

  return (
    <footer id="footer" className="relative border-t border-foreground/10">
      {!isMobile && (
        <div className="absolute inset-0 h-64 opacity-20 pointer-events-none overflow-hidden">
          <AnimatedWave />
        </div>
      )}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="py-16 lg:py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 lg:gap-8">
            <div className="col-span-2">
              <a href="#" className="inline-flex items-center gap-2 mb-6">
                <span className="text-2xl font-display italic">Gaussora</span>
              </a>
              <p className="text-muted-foreground leading-relaxed mb-8 max-w-xs">{t("footer.description")}</p>
              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a key={link.name} href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group">
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium mb-6">{title}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2">{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="py-8 border-t border-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground flex flex-col gap-2">
            <p>{t("footer.rights")}</p>
            <a href="mailto:hy@gaussora.com" className="hover:text-foreground transition-colors">hy@gaussora.com</a>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {t("footer.systemStatus")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
