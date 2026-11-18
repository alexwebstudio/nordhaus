"use client";

/** Собственно GSAP. Импортируется только лениво (через loadGsap), чтобы не тормозить первую отрисовку. */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
