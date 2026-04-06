"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BriefcaseBusiness, Blocks, Mail, ShieldCheck, Users } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

type SectionId = "features" | "use-cases" | "why-us" | "about-us" | "contact";

type TransitionState = {
  from: SectionId;
  to: SectionId;
  key: number;
};

const SWITCHER_DURATION_MS = 460;
const SWITCHER_COOLDOWN_MS = 180;

const SECTION_IDS: SectionId[] = ["features", "use-cases", "why-us", "about-us", "contact"];

const SECTION_CONFIG: Record<
  SectionId,
  {
    titleKey: string;
    subtitle: { en: string; vi: string };
    Icon: typeof BriefcaseBusiness;
  }
> = {
  features: {
    titleKey: "nav.services",
    subtitle: { en: "Service Workspace", vi: "Không gian dịch vụ" },
    Icon: BriefcaseBusiness,
  },
  "use-cases": {
    titleKey: "nav.useCases",
    subtitle: { en: "Use Case Workspace", vi: "Không gian ứng dụng" },
    Icon: Blocks,
  },
  "why-us": {
    titleKey: "nav.whyUs",
    subtitle: { en: "Trust Workspace", vi: "Không gian tin cậy" },
    Icon: ShieldCheck,
  },
  "about-us": {
    titleKey: "nav.aboutUs",
    subtitle: { en: "Team Workspace", vi: "Không gian đội ngũ" },
    Icon: Users,
  },
  contact: {
    titleKey: "nav.contact",
    subtitle: { en: "Contact Workspace", vi: "Không gian kết nối" },
    Icon: Mail,
  },
};

function isSectionId(value: string): value is SectionId {
  return SECTION_IDS.includes(value as SectionId);
}

function WindowCard({ sectionId, isActive }: { sectionId: SectionId; isActive: boolean }) {
  const { t, lang } = useLanguage();
  const config = SECTION_CONFIG[sectionId];
  const Icon = config.Icon;

  return (
    <div
      className={`relative w-[min(86vw,430px)] rounded-2xl border px-5 py-4 shadow-[0_24px_70px_rgba(14,24,40,0.34)] transition-all duration-500 ${
        isActive
          ? "scale-100 border-slate-300/60 bg-slate-100/82 opacity-100 blur-0"
          : "scale-[0.92] border-slate-400/30 bg-slate-200/40 opacity-40 blur-[1px]"
      }`}
    >
      <div className="mb-3 flex items-center gap-2 text-slate-600/80">
        <span className="h-2.5 w-2.5 rounded-full bg-slate-500/45" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-500/30" />
        <span className="h-2.5 w-2.5 rounded-full bg-slate-500/20" />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-slate-700/65">{config.subtitle[lang]}</p>
          <p className="text-xl font-medium text-slate-900">{t(config.titleKey)}</p>
        </div>
        <div className="rounded-xl border border-slate-500/20 bg-white/50 p-2 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export function SectionSwitcherOverlay() {
  const [transition, setTransition] = useState<TransitionState | null>(null);
  const [visible, setVisible] = useState(false);
  const hideTimeoutRef = useRef<number | null>(null);
  const lastTriggerAtRef = useRef(0);
  const visibleRef = useRef(false);
  const activeSectionRef = useRef<SectionId>("features");

  const triggerOverlay = useCallback((nextSection: SectionId) => {
    const now = performance.now();
    const previous = activeSectionRef.current;
    const elapsed = now - lastTriggerAtRef.current;
    if (elapsed < SWITCHER_COOLDOWN_MS && previous === nextSection) return;
    if (previous === nextSection && visibleRef.current) return;

    activeSectionRef.current = nextSection;
    lastTriggerAtRef.current = now;

    setTransition({ from: previous, to: nextSection, key: now });
    setVisible(true);
    visibleRef.current = true;

    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
    }

    hideTimeoutRef.current = window.setTimeout(() => {
      setVisible(false);
      visibleRef.current = false;
    }, SWITCHER_DURATION_MS);
  }, []);

  useEffect(() => {
    const onNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<{ target?: string }>;
      const target = customEvent.detail?.target?.replace("#", "") ?? "";
      if (!isSectionId(target)) return;
      triggerOverlay(target);
    };

    window.addEventListener("bb8:navigate", onNavigate as EventListener);
    return () => {
      window.removeEventListener("bb8:navigate", onNavigate as EventListener);
    };
  }, [triggerOverlay]);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  if (!transition) return null;

  const fromIsSame = transition.from === transition.to;

  return (
    <div className="pointer-events-none fixed inset-0 z-[45] flex items-center justify-center">
      <div
        className={`absolute inset-0 bg-slate-900/30 backdrop-blur-[5px] transition-opacity duration-300 motion-reduce:transition-none ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        key={transition.key}
        className={`relative flex flex-col items-center gap-4 transition-all duration-500 motion-reduce:transition-none ${
          visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.98] opacity-0"
        }`}
      >
        <div className="relative flex items-center justify-center">
          {!fromIsSame ? (
            <div className="absolute -translate-x-6 translate-y-2 transition-all duration-500">
              <WindowCard sectionId={transition.from} isActive={false} />
            </div>
          ) : null}
          <div className="relative z-[1] transition-all duration-500">
            <WindowCard sectionId={transition.to} isActive />
          </div>
        </div>

        <div className="h-1.5 w-[min(82vw,380px)] overflow-hidden rounded-full bg-white/30">
          <div
            className={`h-full bg-slate-900/70 ${
              visible ? "animate-[switchProgress_460ms_ease-out_forwards]" : "w-0"
            } motion-reduce:animate-none`}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes switchProgress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
