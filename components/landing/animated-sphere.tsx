"use client";

import { useEffect, useRef } from "react";

export function AnimatedSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const currentRotRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    // Generate fixed sphere nodes once
    const nodes: { phi: number; theta: number; layer: number }[] = [];
    
    // Create nodes distributed on sphere surface in layers (like neural network layers)
    const layers = [
      { count: 6, radius: 0.4, offset: 0 },    // inner layer
      { count: 12, radius: 0.7, offset: 0.3 },  // middle layer
      { count: 20, radius: 1.0, offset: 0.1 },  // outer layer
    ];

    layers.forEach((layer, layerIdx) => {
      for (let i = 0; i < layer.count; i++) {
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const theta = Math.acos(1 - 2 * (i + 0.5) / layer.count);
        const phi = goldenAngle * i + layer.offset;
        nodes.push({ phi, theta, layer: layerIdx });
      }
    });

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const parentRect = canvas.parentElement?.getBoundingClientRect();
      if (parentRect) {
        mouseRef.current = {
          x: (e.clientX - parentRect.left) / parentRect.width,
          y: (e.clientY - parentRect.top) / parentRect.height,
        };
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const baseRadius = Math.min(rect.width, rect.height) * 0.35;

      // Smooth mouse tracking
      const targetY = (mouseRef.current.x - 0.5) * 1.5;
      const targetX = (mouseRef.current.y - 0.5) * 1.0;
      currentRotRef.current.x += (targetX - currentRotRef.current.x) * 0.04;
      currentRotRef.current.y += (targetY - currentRotRef.current.y) * 0.04;

      // Project all nodes to 2D
      const projected: { x: number; y: number; z: number; layer: number; index: number; pulse: number }[] = [];

      nodes.forEach((node, idx) => {
        const layerRadius = baseRadius * layers[node.layer].radius;

        // Spherical to cartesian
        let x = Math.sin(node.theta) * Math.cos(node.phi + time * 0.2);
        let y = Math.sin(node.theta) * Math.sin(node.phi + time * 0.2);
        let z = Math.cos(node.theta);

        // Rotate Y (mouse + auto)
        const rotY = currentRotRef.current.y + time * 0.12;
        const rx = x * Math.cos(rotY) - z * Math.sin(rotY);
        const rz = x * Math.sin(rotY) + z * Math.cos(rotY);

        // Rotate X (mouse + auto)
        const rotX = currentRotRef.current.x + time * 0.08;
        const ry = y * Math.cos(rotX) - rz * Math.sin(rotX);
        const fz = y * Math.sin(rotX) + rz * Math.cos(rotX);

        // Pulse effect per node
        const pulse = Math.sin(time * 2 + idx * 1.7) * 0.5 + 0.5;

        projected.push({
          x: centerX + rx * layerRadius,
          y: centerY + ry * layerRadius,
          z: fz,
          layer: node.layer,
          index: idx,
          pulse,
        });
      });

      // === Draw connections ===
      // Connect nodes within distance threshold, with inter-layer connections
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // Connection thresholds based on layer relationship
          let maxDist: number;
          if (a.layer === b.layer) {
            maxDist = baseRadius * 0.5; // same layer: shorter connections
          } else if (Math.abs(a.layer - b.layer) === 1) {
            maxDist = baseRadius * 0.8; // adjacent layers: medium connections
          } else {
            maxDist = baseRadius * 0.45; // skip connections: rare
          }

          if (dist < maxDist && dist > 5) {
            const depthAvg = ((a.z + b.z) / 2 + 1) / 2;
            const distFade = 1 - dist / maxDist;
            const alpha = depthAvg * distFade * 0.15;

            // Signal traveling along connection
            const signalPhase = (time * 1.5 + i * 0.5 + j * 0.3) % 1;
            const signalX = a.x + (b.x - a.x) * signalPhase;
            const signalY = a.y + (b.y - a.y) * signalPhase;

            // Draw connection line
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
            ctx.lineWidth = 0.5 + depthAvg * 0.5;
            ctx.stroke();

            // Draw signal dot traveling on connection
            if (distFade > 0.3 && depthAvg > 0.3) {
              const signalAlpha = Math.sin(signalPhase * Math.PI) * alpha * 4;
              ctx.beginPath();
              ctx.arc(signalX, signalY, 1.5, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(0, 0, 0, ${signalAlpha})`;
              ctx.fill();
            }
          }
        }
      }

      // Sort by depth for correct overlap
      projected.sort((a, b) => a.z - b.z);

      // === Draw nodes ===
      projected.forEach((node) => {
        const depth = (node.z + 1) / 2;
        const layerConfig = [
          { baseSize: 3, maxSize: 6, label: false },    // inner: small
          { baseSize: 4, maxSize: 8, label: false },     // middle: medium
          { baseSize: 5, maxSize: 10, label: true },     // outer: large with labels
        ];
        const config = layerConfig[node.layer];
        const size = config.baseSize + depth * (config.maxSize - config.baseSize);
        const alpha = 0.15 + depth * 0.75;

        // Outer ring (glow)
        const glowSize = size + 2 + node.pulse * 3;
        ctx.beginPath();
        ctx.arc(node.x, node.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.06})`;
        ctx.fill();

        // Node circle outline
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 0, 0, ${alpha * 0.6})`;
        ctx.lineWidth = 1 + depth * 0.5;
        ctx.stroke();

        // Node fill
        ctx.beginPath();
        ctx.arc(node.x, node.y, size * 0.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha * (0.3 + node.pulse * 0.4)})`;
        ctx.fill();

        // Activation indicator (pulsing inner dot)
        if (node.pulse > 0.7 && depth > 0.4) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, size * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.9})`;
          ctx.fill();
        }
      });

      // === Draw floating data labels (sparse) ===
      ctx.font = "9px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const labels = ["σ", "∑", "∂", "λ", "Ω", "∞", "π", "∇"];
      for (let i = 0; i < 8; i++) {
        const angle = time * 0.3 + (i / 8) * Math.PI * 2;
        const orbitR = baseRadius * 1.25;
        const lx = centerX + Math.cos(angle) * orbitR;
        const ly = centerY + Math.sin(angle + time * 0.15) * orbitR * 0.6;
        const la = 0.08 + Math.sin(time * 1.5 + i * 2) * 0.06;
        ctx.fillStyle = `rgba(0, 0, 0, ${la})`;
        ctx.fillText(labels[i], lx, ly);
      }

      time += 0.012;
      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}
