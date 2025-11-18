import { Image, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { animate, useMotionValue } from "framer-motion";
import { a, useSpring } from "@react-spring/three";
import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";

export const projects = [
  {
    title: "Soon",
    url: "https://github.com/callmewhatuwant",
    image: "projects/soon.jpg",
    description: "Check out my GitHub account in the meantime.",
  },
  {
    title: "Soon",
    url: "https://github.com/callmewhatuwant",
    image: "projects/soon.jpg",
    description: "Check out my GitHub account in the meantime.",
  },
  {
    title: "Portfolio",
    url: "https://github.com/callmewhatuwant/portfolio/tree/main",
    image: "projects/baking.jpg",
    description: "Check out the code of my portfolio.",
  },
  {
    title: "Age Operator",
    url: "https://age-secrets.com/",
    image: "projects/secret.jpg",
    description: "Kubernetes operator that decrypts age-encrypted secrets",
  },
  {
    title: "Soon",
    url: "https://github.com/callmewhatuwant",
    image: "projects/soon.jpg",
    description: "Check out my GitHub account in the meantime.",
  },
];

const Project = ({ project, highlighted, ...props }) => {
  const background = useRef();
  const bgOpacity = useMotionValue(0.4);

  useEffect(() => {
    animate(bgOpacity, highlighted ? 0.7 : 0.4);
  }, [highlighted]);

  useFrame(() => {
    if (background.current) {
      background.current.material.opacity = bgOpacity.get();
    }
  });

  return (
    <group {...props}>
      <mesh
        position-z={-0.001}
        onClick={() => window.open(project.url, "_blank")}
        ref={background}
      >
        <planeGeometry args={[2.2, 2]} />
        <meshBasicMaterial color="black" transparent opacity={0.4} />
      </mesh>
      <Image
        scale={[2, 1.2, 1]}
        url={project.image}
        toneMapped={false}
        position-y={0.3}
      />
      <Text
        maxWidth={2}
        anchorX="left"
        anchorY="top"
        fontSize={0.2}
        position={[-1, -0.4, 0]}
      >
        {project.title.toUpperCase()}
      </Text>
      <Text
        maxWidth={2}
        anchorX="left"
        anchorY="top"
        fontSize={0.1}
        position={[-1, -0.6, 0]}
      >
        {project.description}
      </Text>
    </group>
  );
};

export const currentProjectAtom = atom(Math.floor(projects.length / 2));

export const Projects = () => {
  const { viewport } = useThree();
  const [currentProject] = useAtom(currentProjectAtom);

  return (
    <group position-y={-viewport.height * 2 + 1}>
      {projects.map((project, index) => {
        const spring = useSpring({
          x: (index - currentProject) * 2.5,
          y: currentProject === index ? 0 : -0.1,
          z: currentProject === index ? -2 : -3,
          rotX: currentProject === index ? 0 : -Math.PI / 3,
          rotZ: currentProject === index ? 0 : -0.1 * Math.PI,
          config: { tension: 220, friction: 24, mass: 2.0 }
        });

        return (
          <a.group
            key={`project_${index}`}
            position-x={spring.x}
            position-y={spring.y}
            position-z={spring.z}
            rotation-x={spring.rotX}
            rotation-z={spring.rotZ}
          >
            <Project project={project} highlighted={index === currentProject} />
          </a.group>
        );
      })}
    </group>
  );
};