'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  createParticleCloud,
  type ParticleCloudInstance,
  type ParticleCloudTheme,
} from '@/lib/particle-cloud/createParticleCloud';
import { useParticleCloud } from './ParticleCloudProvider';
import { useParticleCloudEnabled } from '@/app/hooks/useParticleCloudEnabled';
import AmbientScanOverlay from './AmbientScanOverlay';

const DEFAULT_CAMERA = { distance: 600, orbitX: 0, orbitY: 0 };

function resolveDocumentTheme(): ParticleCloudTheme {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function rotationSpeedForOpacity(opacity: number) {
  return 0.0005 + opacity * 0.001;
}

export default function ParticleCloudCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cloudRef = useRef<ParticleCloudInstance | null>(null);
  const showSplashRef = useRef(false);
  const { phase, canvasOpacity, ambientOpacity, ambientCamera, showSplash } =
    useParticleCloud();
  const webglEnabled = useParticleCloudEnabled();

  useEffect(() => {
    showSplashRef.current = showSplash;
  }, [showSplash]);

  useEffect(() => {
    if (!webglEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const cloud = createParticleCloud(canvas, {
      particleMultiplier: 40,
      theme: showSplashRef.current ? 'matrix' : resolveDocumentTheme(),
    });
    cloudRef.current = cloud;
    cloud.start();

    const onResize = () => cloud.resize();
    window.addEventListener('resize', onResize, { passive: true });

    const themeObserver = new MutationObserver(() => {
      if (showSplashRef.current) return;
      cloud.setTheme(resolveDocumentTheme());
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      window.removeEventListener('resize', onResize);
      themeObserver.disconnect();
      cloud.dispose();
      cloudRef.current = null;
    };
  }, [webglEnabled]);

  useEffect(() => {
    if (!cloudRef.current) return;
    cloudRef.current.setTheme(showSplash ? 'matrix' : resolveDocumentTheme());
  }, [showSplash]);

  useEffect(() => {
    if (!showSplash) return;
    cloudRef.current?.setOpacity(1);
    cloudRef.current?.setRotationSpeed(0.001);
    cloudRef.current?.setCameraView(DEFAULT_CAMERA);
  }, [showSplash]);

  useEffect(() => {
    if (showSplash || phase === 'ambient') return;
    cloudRef.current?.setOpacity(canvasOpacity);
    cloudRef.current?.setRotationSpeed(0.001);
    cloudRef.current?.setCameraView(DEFAULT_CAMERA);
  }, [canvasOpacity, phase, showSplash]);

  useEffect(() => {
    if (!ambientOpacity || showSplash) return;

    const applyOpacity = (value: number) => {
      if (showSplashRef.current || !cloudRef.current) return;
      cloudRef.current.setOpacity(value);
      cloudRef.current.setRotationSpeed(rotationSpeedForOpacity(value));
    };

    applyOpacity(ambientOpacity.get());
    return ambientOpacity.on('change', applyOpacity);
  }, [ambientOpacity, showSplash]);

  useEffect(() => {
    if (!ambientCamera || showSplash || phase !== 'ambient') return;

    const applyCamera = () => {
      if (showSplashRef.current || !cloudRef.current) return;
      cloudRef.current.setCameraView({
        distance: ambientCamera.zoom.get(),
        orbitX: ambientCamera.orbitX.get(),
        orbitY: ambientCamera.orbitY.get(),
      });
    };

    applyCamera();

    const unsubZoom = ambientCamera.zoom.on('change', applyCamera);
    const unsubOrbitX = ambientCamera.orbitX.on('change', applyCamera);
    const unsubOrbitY = ambientCamera.orbitY.on('change', applyCamera);

    return () => {
      unsubZoom();
      unsubOrbitX();
      unsubOrbitY();
    };
  }, [ambientCamera, showSplash, phase]);

  useEffect(() => {
    if (phase === 'hidden' && !showSplash) {
      cloudRef.current?.stop();
    } else if (webglEnabled && cloudRef.current) {
      cloudRef.current.start();
    }
  }, [phase, showSplash, webglEnabled]);

  const showFallback = !webglEnabled && showSplash;
  const showCanvas = webglEnabled || showFallback;

  if (!showCanvas && phase === 'hidden' && !showSplash) {
    return null;
  }

  const wrapperOpacity = showSplash ? 1 : ambientOpacity ?? canvasOpacity;
  const showAmbientScan =
    phase === 'ambient' && !showSplash && webglEnabled && canvasOpacity > 0.05;

  return (
    <motion.div
      aria-hidden
      className={`fixed inset-0 pointer-events-none ${showSplash ? 'z-[99]' : '-z-10'}`}
      initial={false}
      style={{ opacity: wrapperOpacity }}
    >
      {showSplash && (
        <div className="absolute inset-0 bg-[#050505]" aria-hidden />
      )}

      {webglEnabled && (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      )}

      {showAmbientScan && (
        <AmbientScanOverlay
          onScanComplete={() => cloudRef.current?.triggerScanBurst()}
        />
      )}

      {showFallback && (
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 50% 42%, rgba(0,255,120,0.18) 0%, rgba(0,255,120,0.06) 28%, transparent 52%),
              radial-gradient(circle at 50% 42%, transparent 30%, rgba(5,5,5,0.4) 68%, rgba(5,5,5,0.92) 100%),
              #050505
            `,
          }}
        />
      )}

      {showFallback && (
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle, rgba(0,255,120,0.35) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        />
      )}

      {showSplash && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, transparent 0%, transparent 55%, rgba(5,5,5,0.35) 85%, rgba(5,5,5,0.65) 100%)',
          }}
        />
      )}
    </motion.div>
  );
}
