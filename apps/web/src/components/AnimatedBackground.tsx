import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

/**
 * Futuristic animated background using WebGL particles
 * Lightweight and performance-optimized
 */
export const AnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Particle system
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20;
      positions[i + 1] = (Math.random() - 0.5) * 20;
      positions[i + 2] = (Math.random() - 0.5) * 20;

      velocities[i] = (Math.random() - 0.5) * 0.02;
      velocities[i + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i + 2] = (Math.random() - 0.5) * 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Material with glow effect
    const material = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x4a90e2,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const positions = geometry.attributes.position.array as Float32Array;
      const time = Date.now() * 0.0005;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += velocities[i] + Math.sin(time + i) * 0.001;
        positions[i + 1] += velocities[i + 1] + Math.cos(time + i) * 0.001;
        positions[i + 2] += velocities[i + 2];

        // Wrap around boundaries
        if (Math.abs(positions[i]) > 10) velocities[i] *= -1;
        if (Math.abs(positions[i + 1]) > 10) velocities[i + 1] *= -1;
        if (Math.abs(positions[i + 2]) > 10) velocities[i + 2] *= -1;
      }

      geometry.attributes.position.needsUpdate = true;

      // Rotate camera slightly for dynamic feel
      camera.position.x = Math.sin(time * 0.1) * 0.5;
      camera.position.y = Math.cos(time * 0.1) * 0.5;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  );
};


