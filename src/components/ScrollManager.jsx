import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";

export const Character = ({ animationName }) => {
  const group = useRef();
  const { scene, animations } = useGLTF("/mixamo_character.glb");
  const { actions, mixer } = useAnimations(animations, group);
  const current = useRef(null);

  useEffect(() => {
    Object.values(actions).forEach((action) => {
      action.enabled = true;
      action.setEffectiveWeight(1);
      action.timeScale = 0.7;
    });

    if (animationName && actions[animationName]) {
      actions[animationName].reset().fadeIn(0.5).play();
      current.current = animationName;
    }
  }, [actions, animationName]);

  useFrame((state, delta) => {
    mixer.update(delta);
  });

  useEffect(() => {
    if (!animationName || !actions[animationName]) return;
    if (current.current === animationName) return;

    if (current.current && actions[current.current]) {
      actions[current.current].fadeOut(0.5);
    }

    actions[animationName].reset().fadeIn(0.5).play();
    current.current = animationName;
  }, [animationName, actions]);

  return <primitive ref={group} object={scene} />;
};