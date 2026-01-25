import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// 3D Frequency bar component
const FrequencyBar = ({
  position,
  baseHeight,
  color,
  delay,
  index,
  totalBars,
  isInHearingRange,
  frame
}: {
  position: [number, number, number];
  baseHeight: number;
  color: string;
  delay: number;
  index: number;
  totalBars: number;
  isInHearingRange: boolean;
  frame: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animate height with wave pattern
  const waveOffset = index * 0.15;
  const time = Math.max(0, frame - delay) * 0.05;
  const wave = Math.sin(time + waveOffset) * 0.5 + 0.5;
  const pulse = Math.sin(time * 2 + waveOffset) * 0.3 + 0.7;

  const height = baseHeight * (0.3 + wave * 0.7) * pulse;
  const emissiveIntensity = isInHearingRange ? 0.5 + wave * 0.5 : 0.1;

  // Entry animation
  const entryProgress = interpolate(frame - delay, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = entryProgress;

  return (
    <mesh
      ref={meshRef}
      position={[position[0], height / 2 * scale, position[2]]}
      scale={[1, scale, 1]}
    >
      <boxGeometry args={[0.3, height, 0.3]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={emissiveIntensity}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};

// Animated camera
const AnimatedCamera = ({ frame }: { frame: number }) => {
  const { camera } = useThree();

  useFrame(() => {
    // Cinematic camera movement
    const introPhase = interpolate(frame, [0, 120], [0, 1], { extrapolateRight: "clamp" });
    const mainPhase = interpolate(frame, [120, 500], [0, 1], { extrapolateRight: "clamp" });

    // Start far back and zoom in
    const z = interpolate(introPhase, [0, 1], [25, 12]);
    const y = interpolate(introPhase, [0, 1], [15, 8]);

    // Subtle orbit during main phase
    const orbitAngle = mainPhase * Math.PI * 0.3;
    const orbitRadius = 12;

    camera.position.x = Math.sin(orbitAngle) * 3;
    camera.position.y = y - mainPhase * 2;
    camera.position.z = z + Math.cos(orbitAngle) * 2;

    camera.lookAt(0, 2, 0);
  });

  return null;
};


// Particle field using drei's Stars and custom particles
const ParticleField = ({ frame }: { frame: number }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = frame * 0.001;
      groupRef.current.rotation.x = frame * 0.0005;
    }
  });

  // Create individual particle meshes for more control
  const particles = useMemo(() => {
    return Array.from({ length: 200 }, (_, i) => {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 12 + Math.random() * 15;

      return {
        position: [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        ] as [number, number, number],
        color: Math.random() > 0.5 ? "#22c55e" : "#3b82f6",
        size: 0.05 + Math.random() * 0.1,
      };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
};

// Ring pulse effect
const PulseRing = ({ frame, delay }: { frame: number; delay: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const adjustedFrame = Math.max(0, frame - delay);
  const progress = (adjustedFrame % 60) / 60;
  const scale = 1 + progress * 8;
  const opacity = 1 - progress;

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
      <ringGeometry args={[scale, scale + 0.1, 64]} />
      <meshBasicMaterial
        color="#22c55e"
        transparent
        opacity={opacity * 0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Main 3D Scene
const Scene3D = ({ frame }: { frame: number }) => {
  // Generate frequency bars
  const barCount = 50;
  const bars = useMemo(() => {
    return Array.from({ length: barCount }, (_, i) => {
      const angle = (i / barCount) * Math.PI * 2;
      const radius = 6;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Map to frequency (logarithmic)
      const freq = Math.pow(10, 1 + (i / barCount) * 4); // 10Hz to 100kHz
      const isInHearingRange = freq >= 20 && freq <= 20000;

      // Color based on frequency
      let color;
      if (freq < 20) color = "#1e3a8a"; // Infrasound - dark blue
      else if (freq < 200) color = "#22c55e"; // Low bass - green
      else if (freq < 2000) color = "#4ade80"; // Mid - bright green
      else if (freq < 10000) color = "#86efac"; // High - light green
      else if (freq <= 20000) color = "#22d3ee"; // Very high - cyan
      else color = "#6366f1"; // Ultrasound - purple

      return {
        position: [x, 0, z] as [number, number, number],
        baseHeight: 2 + Math.random() * 3,
        color,
        delay: i * 2,
        index: i,
        isInHearingRange,
      };
    });
  }, []);

  // Hearing range reveal timing
  const showLabels = frame > 180;
  const showFact = frame > 350;

  return (
    <>
      <AnimatedCamera frame={frame} />

      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#22c55e" />
      <pointLight position={[-10, 10, -10]} intensity={0.5} color="#3b82f6" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.5}
        penumbra={1}
        intensity={2}
        color="#ffffff"
      />

      {/* Stars background */}
      <Stars radius={100} depth={50} count={3000} factor={4} fade speed={1} />

      {/* Particle field */}
      <ParticleField frame={frame} />

      {/* Ground plane with glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[10, 64]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive="#22c55e"
          emissiveIntensity={0.05}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Pulse rings */}
      {frame > 100 && <PulseRing frame={frame} delay={100} />}
      {frame > 130 && <PulseRing frame={frame} delay={130} />}
      {frame > 160 && <PulseRing frame={frame} delay={160} />}

      {/* Frequency bars */}
      {bars.map((bar, i) => (
        <FrequencyBar
          key={i}
          {...bar}
          totalBars={barCount}
          frame={frame}
        />
      ))}

      {/* Center column */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 5, 32]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive="#22c55e"
          emissiveIntensity={0.3}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </>
  );
};

// 2D Overlay for text (3D text is complex, using 2D overlay)
const TextOverlay = ({ frame }: { frame: number }) => {
  const titleProgress = spring({
    frame: frame - 60,
    fps: 30,
    config: { damping: 12 },
  });

  const numbersProgress = spring({
    frame: frame - 350,
    fps: 30,
    config: { damping: 15 },
  });

  const factProgress = spring({
    frame: frame - 450,
    fps: 30,
    config: { damping: 15 },
  });

  const exitProgress = interpolate(frame, [580, 620], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 60,
        pointerEvents: "none",
        opacity: 1 - exitProgress,
      }}
    >
      {/* Title */}
      <div
        style={{
          textAlign: "center",
          transform: `translateY(${interpolate(titleProgress, [0, 1], [-50, 0])}px)`,
          opacity: titleProgress,
        }}
      >
        <h1
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: "#ffffff",
            margin: 0,
            textShadow: "0 0 60px rgba(34, 197, 94, 0.8), 0 0 120px rgba(34, 197, 94, 0.4)",
            letterSpacing: -2,
          }}
        >
          HUMAN HEARING RANGE
        </h1>
      </div>

      {/* Numbers */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 100,
          transform: `scale(${interpolate(numbersProgress, [0, 1], [0.5, 1])})`,
          opacity: numbersProgress,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: "#22c55e",
              textShadow: "0 0 80px rgba(34, 197, 94, 1), 0 0 160px rgba(34, 197, 94, 0.6)",
              lineHeight: 1,
            }}
          >
            20
          </div>
          <div style={{ fontSize: 36, color: "#22c55e", opacity: 0.8 }}>Hz</div>
        </div>

        <div
          style={{
            fontSize: 60,
            color: "#22c55e",
            textShadow: "0 0 40px rgba(34, 197, 94, 0.8)",
          }}
        >
          →
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: "#22c55e",
              textShadow: "0 0 80px rgba(34, 197, 94, 1), 0 0 160px rgba(34, 197, 94, 0.6)",
              lineHeight: 1,
            }}
          >
            20
          </div>
          <div style={{ fontSize: 36, color: "#22c55e", opacity: 0.8 }}>kHz</div>
        </div>
      </div>

      {/* Bottom fact */}
      <div
        style={{
          textAlign: "center",
          transform: `translateY(${interpolate(factProgress, [0, 1], [50, 0])}px)`,
          opacity: factProgress,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(34, 197, 94, 0.15)",
            backdropFilter: "blur(20px)",
            border: "2px solid rgba(34, 197, 94, 0.3)",
            borderRadius: 20,
            padding: "20px 50px",
          }}
        >
          <span
            style={{
              fontSize: 32,
              color: "#ffffff",
              fontWeight: 600,
            }}
          >
            Memorise this — it appears in{" "}
            <span style={{ color: "#22c55e", fontWeight: 800 }}>every exam</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export const Epic3DHearingRange: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Canvas
        camera={{ position: [0, 10, 20], fov: 50 }}
        gl={{ antialias: true }}
      >
        <Scene3D frame={frame} />
      </Canvas>
      <TextOverlay frame={frame} />
    </AbsoluteFill>
  );
};
