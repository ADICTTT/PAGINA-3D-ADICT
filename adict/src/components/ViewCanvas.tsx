"use client";
import { Canvas } from "@react-three/fiber";
import { Environment, Float, View } from "@react-three/drei";
import FloatingCan from "@/components/FloatingCan";
import { ViewportDepthNode } from "three/webgpu";




type Props = {}

export default function ViewCanvas({}: Props) {
  return (
    <Canvas style = {{
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 30,
    }}
    shadows 
    dpr={[1,1.5]} 
    gl = {{ antialias: true }}
    camera={{
        fov: 30,
    }}
    >
        <FloatingCan />
        <View.Port />
        <Environment files="/hdr/lobby.hdr" environmentIntensity={1.5} />
        </Canvas>
  );
}