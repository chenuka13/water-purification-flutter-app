import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

const WaterBottle = ({ level = 50, uvcActive = false, theme = 'light' }) => {
    const waterRef = useRef();

    // Define the sports bottle profile (wider, cylindrical body)
    const bottleProfile = useMemo(() => {
        const points = [];
        // Bottom - rounded base
        points.push(new THREE.Vector2(0, 0));
        points.push(new THREE.Vector2(0.6, 0));
        points.push(new THREE.Vector2(0.75, 0.1));
        // Main body - wider and more cylindrical, extended height
        points.push(new THREE.Vector2(0.85, 0.3));
        points.push(new THREE.Vector2(0.9, 0.5));
        points.push(new THREE.Vector2(0.9, 2.8)); // Extended from 1.8 to 2.8
        // Shoulder taper
        points.push(new THREE.Vector2(0.85, 3.0));
        points.push(new THREE.Vector2(0.7, 3.1));
        points.push(new THREE.Vector2(0.4, 3.2));
        // Neck
        points.push(new THREE.Vector2(0.4, 3.5));
        return points;
    }, []);

    // Define water profile (slightly smaller than bottle)
    const waterProfile = useMemo(() => {
        const points = [];
        points.push(new THREE.Vector2(0, 0));
        points.push(new THREE.Vector2(0.55, 0));
        points.push(new THREE.Vector2(0.7, 0.1));
        points.push(new THREE.Vector2(0.8, 0.3));
        points.push(new THREE.Vector2(0.85, 0.5));
        points.push(new THREE.Vector2(0.85, 2.8)); // Extended to match bottle
        points.push(new THREE.Vector2(0.8, 3.0));
        points.push(new THREE.Vector2(0.65, 3.1));
        return points;
    }, []);

    // Animate water level
    useFrame((state) => {
        if (waterRef.current) {
            // Scale Y based on level (0 to 100)
            const targetHeight = (level / 100);
            waterRef.current.scale.y = Math.max(0.01, targetHeight);

            // Add slight wobble
            waterRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 2) * 0.02;
            waterRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 1.5) * 0.02;
        }
    });

    return (
        <group dispose={null} position={[0, -1.2, 0]}>
            {/* Bottle Body */}
            <mesh castShadow receiveShadow>
                <latheGeometry args={[bottleProfile, 32]} />
                <MeshTransmissionMaterial
                    backside
                    thickness={0.15}
                    roughness={0.15}
                    transmission={0.98}
                    ior={1.5}
                    chromaticAberration={0.03}
                    background={theme === 'dark' ? '#111827' : '#ffffff'}
                    color="#e0f2fe"
                />
            </mesh>

            {/* Grip Texture Rings */}
            <mesh position={[0, 1.2, 0]}>
                <torusGeometry args={[0.92, 0.03, 8, 32]} />
                <meshStandardMaterial color="#94a3b8" roughness={0.8} metalness={0.2} />
            </mesh>
            <mesh position={[0, 1.6, 0]}>
                <torusGeometry args={[0.92, 0.03, 8, 32]} />
                <meshStandardMaterial color="#94a3b8" roughness={0.8} metalness={0.2} />
            </mesh>
            <mesh position={[0, 2.0, 0]}>
                <torusGeometry args={[0.92, 0.03, 8, 32]} />
                <meshStandardMaterial color="#94a3b8" roughness={0.8} metalness={0.2} />
            </mesh>

            {/* Water Liquid */}
            <mesh ref={waterRef} position={[0, 0.05, 0]}>
                <latheGeometry args={[waterProfile, 32]} />
                <meshStandardMaterial
                    color={uvcActive ? "#8b5cf6" : "#3b82f6"}
                    emissive={uvcActive ? "#8b5cf6" : "#000000"}
                    emissiveIntensity={uvcActive ? 0.5 : 0}
                    transparent
                    opacity={0.8}
                    roughness={0.1}
                    metalness={0.1}
                />
            </mesh>

            {/* Screw Cap Base */}
            <mesh position={[0, 3.5, 0]}>
                <cylinderGeometry args={[0.45, 0.45, 0.3, 32]} />
                <meshStandardMaterial color="#1f2937" roughness={0.4} metalness={0.3} />
            </mesh>

            {/* Cap Threads (visual detail) */}
            <mesh position={[0, 3.38, 0]}>
                <torusGeometry args={[0.42, 0.02, 8, 32]} />
                <meshStandardMaterial color="#374151" />
            </mesh>
            <mesh position={[0, 3.48, 0]}>
                <torusGeometry args={[0.42, 0.02, 8, 32]} />
                <meshStandardMaterial color="#374151" />
            </mesh>
            <mesh position={[0, 3.58, 0]}>
                <torusGeometry args={[0.42, 0.02, 8, 32]} />
                <meshStandardMaterial color="#374151" />
            </mesh>

            {/* Flip-Top Cap */}
            <mesh position={[0, 3.75, 0]}>
                <cylinderGeometry args={[0.4, 0.45, 0.2, 32]} />
                <meshStandardMaterial color="#2563eb" roughness={0.3} metalness={0.4} />
            </mesh>

            {/* Spout */}
            <mesh position={[0, 3.9, 0]}>
                <cylinderGeometry args={[0.15, 0.2, 0.3, 16]} />
                <meshStandardMaterial color="#1e40af" roughness={0.3} />
            </mesh>

            {/* Carry Loop */}
            <mesh position={[0, 4.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.25, 0.05, 8, 16]} />
                <meshStandardMaterial color="#1f2937" roughness={0.5} />
            </mesh>

            {/* UVC LED Light Source (Inside bottle near cap) */}
            {uvcActive && (
                <pointLight
                    position={[0, 3.3, 0]}
                    color="#a855f7"
                    intensity={2.5}
                    distance={5}
                    decay={2}
                />
            )}
        </group>
    );
};

export default WaterBottle;
