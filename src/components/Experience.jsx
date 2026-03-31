import React, { useEffect, useMemo, useRef, useState } from "react";
import { Float, MeshDistortMaterial, MeshWobbleMaterial, useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";

import { Avatar } from "./Avatar";
import { Projects } from "./Projects";
import { Office } from "./Office";
import { Background } from "./Background";

/**
 * React Spring (@react-spring/three) rewrite of the original Framer Motion 3D version.
 * - Replaces <motion.group> with <a.group> and uses useSpring controllers.
 * - Replaces framer-motion motion values & animate() with spring values.
 * - Camera tween for menu open/close is now spring-based (camX, lookX).
 */

export const Experience = (props) => {
  const { menuOpened } = props;
  const { viewport } = useThree();
  const data = useScroll();

  const isMobile = typeof window !== "undefined" ? window.innerWidth < 1000 : false;
  const responsiveRatio = viewport.width / 12;
  const officeScaleRatio = Math.max(0.5, Math.min(0.9 * responsiveRatio, 0.9));

  const [section, setSection] = useState(0);
  const [characterAnimation, setCharacterAnimation] = useState("Typing");

  // --- Camera springs (menu open/close) ---
  const [{ camX, lookX }, camApi] = useSpring(() => ({
    camX: 0,
    lookX: 0,
    config: { tension: 120, friction: 20 },
  }));

  useEffect(() => {
    camApi.start({ camX: menuOpened ? -5 : 0, lookX: menuOpened ? 5 : 0 });
  }, [menuOpened, camApi]);

  // --- Character group springs (depend on section & layout) ---
  const characterTarget = useMemo(() => {
    // defaults (section 0)
    const base = {
      x: 0,
      y: 0,
      z: 0,
      rx: -Math.PI,
      ry: 1.1073981633974483,
      rz: Math.PI,
      sx: officeScaleRatio* 1.1,
      sy: officeScaleRatio* 1.1,
      sz: officeScaleRatio* 1.1,
    };

    if (section === 1) {
      return {
        x: isMobile ? 0.3 : 0,
        y: -viewport.height + 0.5,
        z: 7,
        rx: 0,
        ry: isMobile ? -Math.PI / 2 : 0,
        rz: 0,
        sx: isMobile ? 1.5 : 1,
        sy: isMobile ? 1.5 : 1,
        sz: isMobile ? 1.5 : 1,
      };
    }

    if (section === 2) {
      return {
        x: isMobile ? -1.4 : -2,
        y: -viewport.height * 2 + 0.5,
        z: 0,
        rx: 0,
        ry: Math.PI / 2,
        rz: 0,
        sx: 1,
        sy: 1,
        sz: 1,
      };
    }

    if (section === 3) {
      return {
        x: 0.24,
        y: -viewport.height * 3 + 1,
        z: 8.5,
        rx: 0,
        ry: -Math.PI / 4,
        rz: 0,
        sx: 1,
        sy: 1,
        sz: 1,
      };
    }

    return base;
  }, [section, isMobile, viewport.height, officeScaleRatio]);

  const characterSpring = useSpring({
    ...characterTarget,
    config: { tension: 140, friction: 22 },
  });

  // --- Office container subtle Y spring (parity with previous simple animate) ---
  const officeSpring = useSpring({
    oy: isMobile ? -viewport.height / 6 : 0,
    config: { tension: 120, friction: 20 },
  });

  // --- Skills group spring (z/y based on section) ---
  const skillsSpring = useSpring({
    sz: section === 1 ? 0 : -10,
    sy: section === 1 ? -viewport.height : -1.5,
    config: { tension: 140, friction: 22 },
  });

  // Character placement helper
  const characterContainerAboutRef = useRef();
  const characterGroup = useRef();

  useEffect(() => {
    // mimic the small animation switch from original
    setCharacterAnimation("Falling");
    const t = setTimeout(() => {
      setCharacterAnimation(section === 0 ? "Typing" : "Standing");
    }, 600);
    return () => clearTimeout(t);
  }, [section]);

  useFrame((state) => {
    // Update section from scroll
    const pages = Math.max(1, data.pages || 1);
    let curSection = Math.floor((data.scroll.current || 0) * pages);
    if (curSection > 3) curSection = 3;
    if (curSection !== section) setSection(curSection);

    // Camera X + lookAt X springs
    state.camera.position.x = camX.get();
    state.camera.lookAt(lookX.get(), 0, 0);

    // Update character position with world target when section === 0
    if (section === 0 && characterContainerAboutRef.current && characterGroup.current) {
      characterContainerAboutRef.current.getWorldPosition(characterGroup.current.position);
    }
  });

  return (
    <>
      <Background />

      {/* Character */}
      <a.group
        ref={characterGroup}
        position-x={characterSpring.x}
        position-y={characterSpring.y}
        position-z={characterSpring.z}
        rotation-x={characterSpring.rx}
        rotation-y={characterSpring.ry}
        rotation-z={characterSpring.rz}
        scale-x={characterSpring.sx}
        scale-y={characterSpring.sy}
        scale-z={characterSpring.sz}
      >
        <Avatar animation={characterAnimation} wireframe={section === 1} />
      </a.group>

      <ambientLight intensity={1} />

      {/* Office & anchor for character spot */}
      <a.group
        position={[isMobile ? 0 : 1.5 * officeScaleRatio, isMobile ? -viewport.height / 6 : 2, 3]}
        scale={[officeScaleRatio, officeScaleRatio, officeScaleRatio]}
        rotation-y={-Math.PI / 4}
        position-y={officeSpring.oy}
      >
        <Office section={section} />
        <group
          ref={characterContainerAboutRef}
          name="CharacterSpot"
          position={[-0.23, 0.183, -0.65]}
          rotation={[-Math.PI, 0.322, -Math.PI]}
          scale={1.5}
        />
      </a.group>

      {/* SKILLS */}
      <a.group position-x={0} position-z={skillsSpring.sz} position-y={skillsSpring.sy}>
        <directionalLight position={[-5, 3, 5]} intensity={0.4} />
        <Float>
          <mesh position={[1, -3, -15]} scale={[2, 2, 2]}>
            <sphereGeometry />
            <MeshDistortMaterial opacity={0.8} transparent distort={0.4} speed={4} color={"red"} />
          </mesh>
        </Float>
        <Float>
          <mesh scale={[3, 3, 3]} position={[3, 1, -18]}>
            <sphereGeometry />
            <MeshDistortMaterial opacity={0.8} transparent distort={1} speed={5} color="yellow" />
          </mesh>
        </Float>
        <Float>
          <mesh scale={[1.4, 1.4, 1.4]} position={[-3, -1, -11]}>
            <boxGeometry />
            <MeshWobbleMaterial opacity={0.8} transparent factor={1} speed={5} color={"blue"} />
          </mesh>
        </Float>
      </a.group>

      <Projects />
    </>
  );
};
