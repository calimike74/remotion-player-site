"use client";

import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Sequence,
  Img,
} from "remotion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Text, Float, Environment } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";
import { EducationalBackground, eduTheme } from "../shared/EducationalBackground";

export const ImageDemo3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif",
      }}
    >
      <AbsoluteFill style={{ opacity: fadeOut }}>
        {/* Scene 1: 3D Title with floating cards */}
        <Sequence from={0} durationInFrames={180}>
          <Scene3DIntro />
        </Sequence>

        {/* Scene 2: 3D Image Carousel */}
        <Sequence from={180} durationInFrames={240}>
          <Scene3DCarousel />
        </Sequence>

        {/* Scene 3: 3D Parallax Depth */}
        <Sequence from={420} durationInFrames={200}>
          <Scene3DParallax />
        </Sequence>

        {/* Scene 4: Flying through gallery */}
        <Sequence from={620} durationInFrames={180}>
          <Scene3DGallery />
        </Sequence>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ============================================
// Scene 1: 3D Intro with floating image cards
// ============================================
const Scene3DIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 15 } });
  const subtitleProgress = spring({ frame: frame - 20, fps, config: { damping: 15 } });

  // Exit
  const exitOpacity = interpolate(frame, [150, 180], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", opacity: exitOpacity }}>
      {/* 3D Canvas for floating cards */}
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          <FloatingCard
            position={[-4, 2, -2]}
            rotation={[0.1, 0.3, 0.1]}
            imagePath="/assets/Gemini_Generated_Image_4ac19h4ac19h4ac1.png"
            frame={frame}
            delay={0}
          />
          <FloatingCard
            position={[4, -1, -3]}
            rotation={[-0.1, -0.2, 0.05]}
            imagePath="/assets/Gemini_Generated_Image_csramicsramicsra.png"
            frame={frame}
            delay={10}
          />
          <FloatingCard
            position={[-3, -2, -4]}
            rotation={[0.05, 0.4, -0.1]}
            imagePath="/assets/image_fx_-3.jpg"
            frame={frame}
            delay={20}
          />
          <FloatingCard
            position={[3, 2.5, -5]}
            rotation={[-0.15, -0.3, 0.1]}
            imagePath="/assets/image_fx_-4.jpg"
            frame={frame}
            delay={30}
          />
        </Suspense>
      </Canvas>

      {/* Overlay title */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        <h1
          style={{
            fontSize: 100,
            fontWeight: 800,
            color: "#ffffff",
            margin: 0,
            textShadow: "0 0 60px rgba(59, 130, 246, 0.5)",
            transform: `translateY(${interpolate(titleProgress, [0, 1], [80, 0])}px) scale(${titleProgress})`,
            opacity: titleProgress,
          }}
        >
          3D Image Showcase
        </h1>
        <p
          style={{
            fontSize: 36,
            color: "rgba(255, 255, 255, 0.7)",
            margin: 0,
            marginTop: 20,
            transform: `translateY(${interpolate(subtitleProgress, [0, 1], [40, 0])}px)`,
            opacity: subtitleProgress,
          }}
        >
          Three.js + Remotion + Your Images
        </p>
      </div>
    </AbsoluteFill>
  );
};

// Floating 3D card component
const FloatingCard: React.FC<{
  position: [number, number, number];
  rotation: [number, number, number];
  imagePath: string;
  frame: number;
  delay: number;
}> = ({ position, rotation, imagePath, frame, delay }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animate entry
  const entryProgress = Math.min(1, Math.max(0, (frame - delay) / 30));
  const scale = entryProgress;

  // Gentle floating animation
  const floatY = Math.sin((frame + delay * 10) * 0.05) * 0.2;
  const floatRotation = Math.sin((frame + delay * 5) * 0.03) * 0.1;

  // Load texture using public path
  const texture = useTexture(imagePath);

  return (
    <mesh
      ref={meshRef}
      position={[position[0], position[1] + floatY, position[2]]}
      rotation={[rotation[0] + floatRotation, rotation[1], rotation[2]]}
      scale={scale}
    >
      <planeGeometry args={[4, 2.25]} />
      <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
};

// ============================================
// Scene 2: 3D Rotating Carousel
// ============================================
const Scene3DCarousel: React.FC = () => {
  const frame = useCurrentFrame();

  // Exit
  const exitOpacity = interpolate(frame, [200, 240], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#0a0a0a", opacity: exitOpacity }}>
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <spotLight position={[0, 10, 10]} angle={0.3} intensity={1} />
        <Suspense fallback={null}>
          <CarouselRing frame={frame} />
        </Suspense>
      </Canvas>

      {/* Title overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            textShadow: "0 4px 20px rgba(0, 0, 0, 0.8)",
          }}
        >
          3D Image Carousel
        </h2>
      </div>
    </AbsoluteFill>
  );
};

// Carousel ring of images
const CarouselRing: React.FC<{ frame: number }> = ({ frame }) => {
  const groupRef = useRef<THREE.Group>(null);

  const images = [
    "/assets/Gemini_Generated_Image_gw65gigw65gigw65.png",
    "/assets/Gemini_Generated_Image_csramicsramicsra.png",
    "/assets/Gemini_Generated_Image_4ac19h4ac19h4ac1.png",
    "/assets/image_fx_-3.jpg",
    "/assets/image_fx_-4.jpg",
    "/assets/image_fx-2.jpg",
  ];

  // Rotation speed
  const rotation = (frame * 0.015);

  return (
    <group ref={groupRef} rotation={[0, rotation, 0]}>
      {images.map((img, i) => {
        const angle = (i / images.length) * Math.PI * 2;
        const radius = 6;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        return (
          <CarouselCard
            key={img}
            position={[x, 0, z]}
            rotation={[0, -angle + Math.PI, 0]}
            imagePath={img}
          />
        );
      })}
    </group>
  );
};

const CarouselCard: React.FC<{
  position: [number, number, number];
  rotation: [number, number, number];
  imagePath: string;
}> = ({ position, rotation, imagePath }) => {
  const texture = useTexture(imagePath);

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[4, 2.5]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        transparent
      />
    </mesh>
  );
};

// ============================================
// Scene 3: 3D Parallax Depth
// ============================================
const Scene3DParallax: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mouse-like movement based on frame
  const moveX = Math.sin(frame * 0.02) * 30;
  const moveY = Math.cos(frame * 0.015) * 20;

  // Exit
  const exitOpacity = interpolate(frame, [160, 200], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Entry
  const entryProgress = spring({ frame, fps, config: { damping: 15 } });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        perspective: "1000px",
        overflow: "hidden",
        opacity: exitOpacity,
      }}
    >
      {/* Far layer (slowest) */}
      <ParallaxLayer
        depth={0.1}
        moveX={moveX}
        moveY={moveY}
        opacity={0.3}
        scale={0.6 * entryProgress}
      >
        <Img
          src={staticFile("assets/image_fx_-4.jpg")}
          style={{
            width: 600,
            borderRadius: 20,
            position: "absolute",
            top: "20%",
            left: "10%",
          }}
        />
      </ParallaxLayer>

      {/* Mid layer */}
      <ParallaxLayer
        depth={0.3}
        moveX={moveX}
        moveY={moveY}
        opacity={0.6}
        scale={0.8 * entryProgress}
      >
        <Img
          src={staticFile("assets/Gemini_Generated_Image_csramicsramicsra.png")}
          style={{
            width: 500,
            borderRadius: 16,
            position: "absolute",
            top: "30%",
            right: "15%",
          }}
        />
      </ParallaxLayer>

      {/* Near layer (fastest) */}
      <ParallaxLayer
        depth={0.6}
        moveX={moveX}
        moveY={moveY}
        opacity={0.9}
        scale={entryProgress}
      >
        <Img
          src={staticFile("assets/Gemini_Generated_Image_gw65gigw65gigw65.png")}
          style={{
            width: 700,
            borderRadius: 12,
            position: "absolute",
            bottom: "10%",
            left: "25%",
            boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5)",
          }}
        />
      </ParallaxLayer>

      {/* Closest layer - UI elements */}
      <ParallaxLayer
        depth={0.9}
        moveX={moveX}
        moveY={moveY}
        opacity={1}
        scale={entryProgress}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <h2
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#ffffff",
              textAlign: "center",
              textShadow: "0 0 40px rgba(79, 70, 229, 0.8)",
              margin: 0,
            }}
          >
            Parallax Depth
          </h2>
          <p
            style={{
              fontSize: 28,
              color: "rgba(255, 255, 255, 0.7)",
              textAlign: "center",
              margin: 0,
              marginTop: 16,
            }}
          >
            Layers moving at different speeds
          </p>
        </div>
      </ParallaxLayer>
    </AbsoluteFill>
  );
};

// Parallax layer component
const ParallaxLayer: React.FC<{
  children: React.ReactNode;
  depth: number;
  moveX: number;
  moveY: number;
  opacity: number;
  scale: number;
}> = ({ children, depth, moveX, moveY, opacity, scale }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      transform: `translate(${moveX * depth}px, ${moveY * depth}px) scale(${scale})`,
      opacity,
      transition: "transform 0.1s ease-out",
    }}
  >
    {children}
  </div>
);

// ============================================
// Scene 4: Flying through 3D gallery
// ============================================
const Scene3DGallery: React.FC = () => {
  const frame = useCurrentFrame();

  // Camera moves forward through the gallery
  const cameraZ = interpolate(frame, [0, 180], [20, -10], {
    extrapolateRight: "clamp",
  });

  // Exit
  const exitOpacity = interpolate(frame, [150, 180], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#000000", opacity: exitOpacity }}>
      <Canvas>
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 10]} intensity={1} color="#4f46e5" />
        <pointLight position={[0, 0, -10]} intensity={0.5} color="#06b6d4" />
        <Suspense fallback={null}>
          <GalleryTunnel frame={frame} cameraZ={cameraZ} />
        </Suspense>
      </Canvas>

      {/* Overlay text */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            textShadow: "0 0 30px rgba(79, 70, 229, 0.8)",
          }}
        >
          Gallery Flythrough
        </h2>
      </div>
    </AbsoluteFill>
  );
};

// 3D gallery tunnel
const GalleryTunnel: React.FC<{ frame: number; cameraZ: number }> = ({ frame, cameraZ }) => {
  const { camera } = useThree();

  // Update camera position
  camera.position.z = cameraZ;
  camera.position.x = Math.sin(frame * 0.02) * 0.5;
  camera.position.y = Math.cos(frame * 0.015) * 0.3;

  const images = [
    "/assets/Gemini_Generated_Image_gw65gigw65gigw65.png",
    "/assets/Gemini_Generated_Image_csramicsramicsra.png",
    "/assets/Gemini_Generated_Image_4ac19h4ac19h4ac1.png",
    "/assets/Gemini_Generated_Image_vejqs8vejqs8vejq.png",
    "/assets/image_fx_-3.jpg",
    "/assets/image_fx_-4.jpg",
  ];

  // Create frames along the tunnel
  const frames: Array<{ z: number; x: number; y: number; rotation: number; img: string }> = [];

  for (let i = 0; i < 12; i++) {
    const z = 15 - i * 4;
    const angle = i * 0.8;
    const radius = 4;
    frames.push({
      z,
      x: Math.sin(angle) * radius,
      y: Math.cos(angle) * radius * 0.5,
      rotation: angle,
      img: images[i % images.length],
    });
  }

  return (
    <group>
      {frames.map((f, i) => (
        <GalleryFrame
          key={i}
          position={[f.x, f.y, f.z]}
          rotation={[0, f.rotation * 0.3, 0]}
          imagePath={f.img}
        />
      ))}

      {/* Particle-like ambient elements */}
      {[...Array(30)].map((_, i) => (
        <mesh
          key={`particle-${i}`}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 6,
            Math.random() * 30 - 15,
          ]}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#4f46e5" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
};

const GalleryFrame: React.FC<{
  position: [number, number, number];
  rotation: [number, number, number];
  imagePath: string;
}> = ({ position, rotation, imagePath }) => {
  const texture = useTexture(imagePath);

  return (
    <group position={position} rotation={rotation}>
      {/* Frame border */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[3.4, 2.15, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Image */}
      <mesh>
        <planeGeometry args={[3.2, 2]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
};
