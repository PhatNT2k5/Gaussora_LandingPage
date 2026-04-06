"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

export function SplineRobot() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Forward wheel events from Spline canvas to window scroll
    const handleWheel = (e: WheelEvent) => {
      window.scrollBy({ top: e.deltaY, behavior: "auto" });
    };

    container.addEventListener("wheel", handleWheel, { passive: true });
    return () => container.removeEventListener("wheel", handleWheel);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      <Spline scene="https://prod.spline.design/f2Z2DxWSL7U566ML/scene.splinecode" />
    </div>
  );
}
