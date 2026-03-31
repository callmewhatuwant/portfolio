import { useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const ScrollManager = (props) => {
  const { section, onSectionChange } = props;

  const data = useScroll();

  const lastScroll = useRef(0);
  const scroll = useRef(0);
  const isAnimating = useRef(false);

  data.fill.classList.add("top-0");
  data.fill.classList.add("absolute");

  useEffect(() => {
    gsap.to(data.el, {
      duration: 1.5,
      scrollTop: section * data.el.clientHeight,
      ease: "power2.out",
      onStart: () => {
        isAnimating.current = true;
      },
      onComplete: () => {
        isAnimating.current = false;
      },
    });
  }, [section]);

  useFrame(() => {
    scroll.current = THREE.MathUtils.lerp(
      scroll.current,
      data.scroll.current,
      0.1
    );

    if (isAnimating.current) {
      lastScroll.current = scroll.current;
      return;
    }

    const curSection = Math.floor(scroll.current * data.pages);

    if (scroll.current > lastScroll.current + 0.01 && curSection === 0) {
      onSectionChange(1);
    }

    if (
      scroll.current < lastScroll.current - 0.01 &&
      scroll.current < 1 / (data.pages - 1)
    ) {
      onSectionChange(0);
    }

    lastScroll.current = scroll.current;
  });

  return null;
};