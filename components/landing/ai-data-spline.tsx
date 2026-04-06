"use client";

import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
});

export function AiDataSpline() {
  return (
    <div className="h-full w-full overflow-hidden rounded-3xl border border-foreground/10 shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
      <Spline scene="https://prod.spline.design/rQojPBADLwqV-sxJ/scene.splinecode" />
    </div>
  );
}
