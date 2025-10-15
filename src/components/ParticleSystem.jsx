import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleBurst = ({ type, trigger, onComplete }) => {
  const meshRef = useRef();
  const particlesRef = useRef();
  const materialRef = useRef();
  
  const particleCount = 120; // More particles for richer effect
  const radius = 0.1;
  
  // Create high-quality particle textures
  const createParticleTexture = (type) => {
    const canvas = document.createElement('canvas');
    const size = 64; // High resolution
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    
    // Create gradient for beautiful particles
    const gradient = context.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    
    if (type === 'success') {
      // Golden sparkle texture
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 215, 0, 0.8)');
      gradient.addColorStop(0.7, 'rgba(255, 165, 0, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 140, 0, 0)');
    } else {
      // Red ember texture
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 100, 100, 0.8)');
      gradient.addColorStop(0.7, 'rgba(200, 50, 50, 0.6)');
      gradient.addColorStop(1, 'rgba(150, 0, 0, 0)');
    }
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    
    // Add sparkle effect
    context.fillStyle = 'rgba(255, 255, 255, 0.9)';
    for (let i = 0; i < 8; i++) {
      const x = size/2 + (Math.random() - 0.5) * size * 0.6;
      const y = size/2 + (Math.random() - 0.5) * size * 0.6;
      const sparkleSize = Math.random() * 3 + 1;
      context.fillRect(x, y, sparkleSize, sparkleSize);
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Create geometry and material once
  const { geometry, material, velocities, sizes } = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount); // For size variations
    
    // Initialize all particles at center
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = 0;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = 0;
      
      // Beautiful colors with variations based on type
      if (type === 'success') {
        // Golden success particles with variations
        const goldVariation = 0.1 + Math.random() * 0.2;
        colors[i3] = 1; // R - Full red for gold
        colors[i3 + 1] = 0.7 + goldVariation; // G - Golden yellow
        colors[i3 + 2] = 0.1 + Math.random() * 0.1; // B - Slight blue for warmth
      } else {
        // Dark red failure particles with variations
        const redVariation = 0.1 + Math.random() * 0.2;
        colors[i3] = 0.8 + redVariation; // R - Deep red
        colors[i3 + 1] = 0.1 + Math.random() * 0.1; // G - Very little green
        colors[i3 + 2] = 0.1 + Math.random() * 0.1; // B - Very little blue
      }
      
      // Beautiful particle patterns
      if (type === 'success') {
        // Golden sparkle explosion with multiple layers
        const layer = Math.floor(i / (particleCount / 3)); // 3 layers
        const angle = (i / particleCount) * Math.PI * 2;
        const speed = (0.02 + Math.random() * 0.03) * (1 + layer * 0.3); // Layered speeds
        
        // Create spiral pattern for more beautiful effect
        const spiral = Math.sin(angle * 3) * 0.1;
        velocities[i3] = Math.cos(angle) * speed + spiral;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.05 + layer * 0.02; // Upward bias for layers
        velocities[i3 + 2] = Math.sin(angle) * speed + spiral;
      } else {
        // Dark ember implosion with swirling motion
        const angle = (i / particleCount) * Math.PI * 2;
        const speed = 0.015 + Math.random() * 0.01; // Slower for failure
        
        // Add swirling motion
        const swirl = Math.sin(angle * 2) * 0.05;
        velocities[i3] = -Math.cos(angle) * speed + swirl;
        velocities[i3 + 1] = (Math.random() - 0.5) * 0.02; // Less vertical movement
        velocities[i3 + 2] = -Math.sin(angle) * speed + swirl;
      }
      
      // Size variations for more beautiful effect
      sizes[i] = 0.8 + Math.random() * 0.4; // Size between 0.8 and 1.2
    }
    
    // Set up geometry attributes
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create high-quality material with custom texture
    const particleTexture = createParticleTexture(type);
    const material = new THREE.PointsMaterial({
      size: 0.15, // Larger particles for better visibility
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true, // Particles get smaller with distance
      alphaTest: 0.01, // Better transparency handling
      map: particleTexture, // Use our custom high-quality texture
      fog: false, // Disable fog for better visibility
      depthWrite: false // Better transparency rendering
    });
    
    return { geometry, material, velocities, sizes };
  }, [type]);
  
  useEffect(() => {
    if (trigger && geometry) {
      // Reset positions to center
      const positionAttribute = geometry.getAttribute('position');
      if (positionAttribute) {
        const positions = positionAttribute.array;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          positions[i3] = 0;
          positions[i3 + 1] = 0;
          positions[i3 + 2] = 0;
        }
        positionAttribute.needsUpdate = true;
      }
      
      // Reset material opacity
      if (material) {
        material.opacity = 1;
      }
    }
  }, [trigger, geometry, material]);
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      if (geometry) {
        geometry.dispose();
      }
      if (material) {
        material.dispose();
      }
    };
  }, [geometry, material]);
  
  useFrame((state, delta) => {
    if (!meshRef.current || !geometry) return;
    
    const positionAttribute = geometry.getAttribute('position');
    if (!positionAttribute) return;
    
    const positions = positionAttribute.array;
    const time = state.clock.getElapsedTime();
    
    let allInvisible = true;
    
    // Smooth easing function for more natural motion
    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Apply smooth easing to velocity over time
      const timeFactor = Math.max(0, 1 - time * 0.3); // Slow down over time
      const easedFactor = easeOutQuart(timeFactor);
      
      // Update positions with smooth motion
      positions[i3] += velocities[i3] * easedFactor * delta * 60; // 60fps normalization
      positions[i3 + 1] += velocities[i3 + 1] * easedFactor * delta * 60;
      positions[i3 + 2] += velocities[i3 + 2] * easedFactor * delta * 60;
      
      // Beautiful physics and effects
      if (type === 'success') {
        // Gentle gravity with easing
        positions[i3 + 1] -= delta * 0.006 * easedFactor; // Very gentle gravity
        
        // Add beautiful rotation with multiple axes
        const rotationSpeed = 0.3;
        const cos = Math.cos(time * rotationSpeed);
        const sin = Math.sin(time * rotationSpeed);
        const x = positions[i3];
        const z = positions[i3 + 2];
        positions[i3] = x * cos - z * sin;
        positions[i3 + 2] = x * sin + z * cos;
        
        // Add twinkling motion
        const twinkle = Math.sin(time * 4 + i * 0.1) * 0.02;
        positions[i3] += twinkle;
        positions[i3 + 2] += twinkle;
        
        // Add upward spiral for golden particles
        const spiralUp = Math.sin(time * 2 + i * 0.2) * 0.01;
        positions[i3 + 1] += spiralUp;
      } else {
        // Dark ember physics
        positions[i3 + 1] += delta * 0.003 * easedFactor; // Very gentle anti-gravity
        
        // Add swirling motion
        const swirlSpeed = 0.8;
        const cos = Math.cos(time * swirlSpeed);
        const sin = Math.sin(time * swirlSpeed);
        const x = positions[i3];
        const z = positions[i3 + 2];
        positions[i3] = x * cos - z * sin * 0.5;
        positions[i3 + 2] = x * sin * 0.5 + z * cos;
        
        // Add pulsing effect
        const pulse = Math.sin(time * 3 + i * 0.15) * 0.008;
        positions[i3] += pulse;
        positions[i3 + 2] += pulse;
        positions[i3 + 1] += pulse * 0.5;
      }
      
      // Check if particle is still visible
      const distance = Math.sqrt(
        positions[i3] ** 2 + 
        positions[i3 + 1] ** 2 + 
        positions[i3 + 2] ** 2
      );
      
      if (distance < 2.5) { // Larger visible range for slower particles
        allInvisible = false;
      }
    }
    
    // Beautiful twinkling and fade out with easing
    if (material) {
      const fadeTime = 5.0; // Even longer fade time for maximum enjoyment
      const fadeProgress = Math.min(time / fadeTime, 1);
      const easedFade = easeInOutCubic(fadeProgress);
      
      // Enhanced twinkling effect
      const twinkle1 = Math.sin(time * 12) * 0.15 + 0.85; // Fast twinkling
      const twinkle2 = Math.sin(time * 7 + Math.PI/3) * 0.1 + 0.9; // Secondary twinkle
      const combinedTwinkle = (twinkle1 + twinkle2) / 2;
      
      material.opacity = Math.max(0, (1 - easedFade) * combinedTwinkle);
      
      // Dynamic size changes for sparkle effect
      const sizeVariation1 = Math.sin(time * 8) * 0.08 + 0.92;
      const sizeVariation2 = Math.sin(time * 5 + Math.PI/4) * 0.05 + 0.95;
      const combinedSize = (sizeVariation1 + sizeVariation2) / 2;
      material.size = 0.15 * combinedSize;
      
      // Add color intensity variation for more magic
      if (type === 'success') {
        const colorIntensity = Math.sin(time * 6) * 0.2 + 0.8;
        material.color.setRGB(1, 0.8 * colorIntensity, 0.2 * colorIntensity);
      } else {
        const colorIntensity = Math.sin(time * 4) * 0.15 + 0.85;
        material.color.setRGB(0.9 * colorIntensity, 0.1 * colorIntensity, 0.1 * colorIntensity);
      }
    }
    
    positionAttribute.needsUpdate = true;
    
    // Complete animation when all particles are gone or faded (longer duration)
    if (time > 5.5 || (allInvisible && time > 2.0)) {
      if (onComplete) {
        onComplete();
      }
    }
  });
  
  return (
    <points ref={meshRef} geometry={geometry} material={material} />
  );
};

const ParticleSystem = ({ type, trigger, onComplete }) => {
  if (!trigger) return null;
  
  return (
    <div className="absolute inset-0 pointer-events-none z-25 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 50 }}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        <ambientLight intensity={0.5} />
        <ParticleBurst type={type} trigger={trigger} onComplete={onComplete} />
      </Canvas>
    </div>
  );
};

export default ParticleSystem;
