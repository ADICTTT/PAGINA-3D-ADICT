"use client";

import { Float } from '@react-three/drei';
import { SodaCan, SodaCanProps } from '@/components/SodaCan';
import { forwardRef, ReactNode } from 'react';
import { Group } from 'three';
import { getDisplayName } from 'next/dist/shared/lib/utils';

type FloatingCanProps = {
    flavor?: SodaCanProps["flavor"];
    floatSpeed?: number;
    rotationIntensity?: number;
    floatIntensity?: number;
    floatingRange?: [number, number]; 
    children?: ReactNode;
};

const FloatingCan = forwardRef<Group, FloatingCanProps>(
    (
        {
            flavor = "blackCherry",
            floatSpeed = 1.5,
            rotationIntensity = 1,
            floatIntensity = 1,
            floatingRange = [-0.1, 0.1],
            children,
            ...props
        },
        ref
    ) => {
        return (
            <group ref={ref} {...props}> 
                <Float
                    speed={floatSpeed}
                    rotationIntensity={rotationIntensity}
                    floatIntensity={floatIntensity}
                    floatingRange={floatingRange} // Uso correcto
                > 
                    {children}   
                    <SodaCan flavor={flavor} />
                </Float>
            </group>
        );
    }
);

FloatingCan.displayName = "FloatingCan";

export default FloatingCan;