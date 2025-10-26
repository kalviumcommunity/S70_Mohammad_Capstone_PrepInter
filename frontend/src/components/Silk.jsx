/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { forwardRef, useRef, useMemo, useLayoutEffect } from 'react';
import { useEffect, useState } from 'react';
import { Color } from 'three';

const hexToNormalizedRGB = hex => {
  hex = hex.replace('#', '');
  return [
    parseInt(hex.slice(0, 2), 16) / 255,
    parseInt(hex.slice(2, 4), 16) / 255,
    parseInt(hex.slice(4, 6), 16) / 255
  ];
};

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vPosition = position;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy * 0.5);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime * 0.5;

  tex.y += 0.02 * sin(6.0 * tex.x - tOffset);

  float pattern = 0.7 +
                  0.3 * sin(4.0 * (tex.x + tex.y +
                                   cos(2.0 * tex.x + 4.0 * tex.y) +
                                   0.015 * tOffset) +
                           sin(15.0 * (tex.x + tex.y - 0.08 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd * 0.05 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

const SilkPlane = forwardRef(function SilkPlane({ uniforms, scrollStrength = 0.2 }, ref) {
  const { viewport } = useThree();
  const [scrollY, setScrollY] = useState(0);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [ref, viewport]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY || 0);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useFrame((_, delta) => {
    // Smoother time evolution with frame-rate independent animation
    ref.current.material.uniforms.uTime.value += delta * 2.0;
    // Smoother rotation interpolation
    const targetRot = (scrollY * 0.0003) % (Math.PI * 2);
    const rot = ref.current.material.uniforms.uRotation.value;
    ref.current.material.uniforms.uRotation.value = rot + (targetRot - rot) * (scrollStrength * 0.8);
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent={false}
        depthWrite={false}
        depthTest={false} />
    </mesh>
  );
});
SilkPlane.displayName = 'SilkPlane';

const Silk = ({ speed = 4, scale = 1, color = '#7B7481', noiseIntensity = 1, rotation = 0, scrollStrength = 0.15 }) => {
  const meshRef = useRef();

  const uniforms = useMemo(() => ({
    uSpeed: { value: speed },
    uScale: { value: scale },
    uNoiseIntensity: { value: noiseIntensity },
    uColor: { value: new Color(...hexToNormalizedRGB(color)) },
    uRotation: { value: rotation },
    uTime: { value: 0 }
  }), [speed, scale, noiseIntensity, color, rotation]);

  return (
    <Canvas 
      dpr={[1, 1.5]} 
      frameloop="always" 
      gl={{ 
        antialias: true, 
        powerPreference: 'high-performance',
        alpha: false,
        depth: false,
        stencil: false
      }}
      performance={{ min: 0.5 }}
    >
      <SilkPlane ref={meshRef} uniforms={uniforms} scrollStrength={scrollStrength} />
    </Canvas>
  );
};

export default Silk;