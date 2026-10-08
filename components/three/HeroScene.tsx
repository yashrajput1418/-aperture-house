'use client';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, Lightformer, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

function Blob() {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((state, dt) => {
    mesh.current.rotation.y += dt * 0.15;
    // follow the pointer gently
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, state.pointer.y * 0.4, 0.05);
    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, state.pointer.x * 0.3, 0.05);
  });
  return (
    <Float speed={1.6} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={mesh} scale={1.75}>
        <icosahedronGeometry args={[1, 64]} />
        <MeshDistortMaterial
          color="#7c5cff"
          emissive="#2a1470"
          roughness={0.15}
          metalness={0.6}
          distort={0.42}
          speed={1.8}
        />
      </mesh>
    </Float>
  );
}

function Orbiter({ position, color, geo }: { position: [number, number, number]; color: string; geo: 'torus' | 'box' | 'oct' }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, dt) => { ref.current.rotation.x += dt * 0.6; ref.current.rotation.y += dt * 0.4; });
  return (
    <Float speed={2.5} floatIntensity={2}>
      <mesh ref={ref} position={position} scale={0.32}>
        {geo === 'torus' && <torusGeometry args={[1, 0.38, 32, 64]} />}
        {geo === 'box' && <boxGeometry args={[1.3, 1.3, 1.3]} />}
        {geo === 'oct' && <octahedronGeometry args={[1.2]} />}
        <meshStandardMaterial color={color} roughness={0.25} metalness={0.7} />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
      <pointLight position={[-4, -2, 3]} intensity={30} color="#c6ff3d" />
      <pointLight position={[4, 3, -2]} intensity={25} color="#21d4fd" />
      <Blob />
      <Orbiter position={[2.6, 1.4, -0.5]} color="#c6ff3d" geo="torus" />
      <Orbiter position={[-2.7, -1.2, 0.2]} color="#21d4fd" geo="oct" />
      <Orbiter position={[-2.2, 1.8, -1]} color="#f857a6" geo="box" />
      <Sparkles count={60} scale={[9, 6, 4]} size={2} speed={0.4} color="#ffffff" opacity={0.5} />
      {/* local studio lighting: no HDR file downloaded from a CDN */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={3} position={[0, 4, -6]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={2} color="#c6ff3d" position={[-6, 0, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={2} color="#21d4fd" position={[6, 1, 1]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={4} position={[0, 0, 8]} scale={3} />
      </Environment>
    </Canvas>
  );
}
