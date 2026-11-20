'use client';

/*
React Bits Fade Content (TypeScript + Tailwind)
https://github.com/DavidHDev/react-bits/blob/701a8acc34f718b305d1ff0cc7d4700df0e1f1c9/src/ts-tailwind/Animations/FadeContent/FadeContent.tsx

MIT + Commons Clause License Condition v1.0

Copyright (c) 2026 David Haz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, and distribute the Software **as part of an application, website, or product**, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

## Commons Clause Restriction

You may use this Software, including for any commercial purpose, **so long as you do not sell, sublicense, or redistribute the components themselves-whether alone, in a bundle, or as a ported version.**

The same restriction covers the React Bits tools (Background Studio, Texture Lab, Shape Magic, Center Stage, Sound Lab and any tools added later) and the sounds in the sound library. **You may not sell, sublicense, or redistribute the tools or the sounds themselves, or offer the tools or a substantially similar copy of them as a hosted service-whether alone, in a bundle, or as a ported version.**

What you make with the tools is yours to use. You can use exported code, images, videos, and audio files in any personal or commercial application, website, or product, including paid ones. **You may not sell or redistribute the exports on their own, either individually or as the product itself, such as a sound, texture, background, or template pack.**

## No Warranty

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { useEffect, useLayoutEffect, useRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type FadeContentEffect = 'fade' | 'focus' | 'develop' | 'dissolve' | 'mist' | 'pixel';
export type FadeContentStaggerFrom = 'start' | 'end' | 'center' | 'edges' | 'random';

export interface FadeContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  container?: Element | string | null;
  effect?: FadeContentEffect;
  blur?: boolean | number;
  duration?: number;
  ease?: string;
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
  stagger?: number;
  staggerFrom?: FadeContentStaggerFrom;
  trigger?: 'scroll' | 'mount';
  once?: boolean;
  exit?: boolean;
  scrub?: boolean | number;
  disappearAfter?: number;
  disappearDuration?: number;
  disappearEase?: string;
  onStart?: () => void;
  onComplete?: () => void;
  onDisappearanceComplete?: () => void;
  className?: string;
  style?: CSSProperties;
}

interface Look {
  from: gsap.TweenVars;
  to: gsap.TweenVars;
  share: number;
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const SVG_NS = 'http://www.w3.org/2000/svg';

const NOISE_EFFECTS = ['dissolve', 'mist', 'pixel'];

const LEVELS = Array.from({ length: 33 }, (_, i) => 1 / (1 + Math.exp(-10.8 * (i / 32 - 0.5))));

let maskCount = 0;

const toSeconds = (value: number) => (typeof value === 'number' && value > 10 ? value / 1000 : value);

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);

const smoothstep = (from: number, to: number, value: number) => {
  const t = clamp01((value - from) / (to - from));
  return t * t * (3 - 2 * t);
};

const noiseFor = (kind: string, size: number) => {
  if (kind === 'mist') {
    return { frequency: Math.min(Math.max(4 / size, 0.004), 0.02), octaves: 3, edge: 0.35, blur: 10, block: 0 };
  }
  if (kind === 'pixel') {
    const block = 2 * Math.round(Math.min(Math.max(size / 32, 6), 24) / 2);
    return { frequency: 0.5 / block, octaves: 1, edge: 0.06, blur: 0, block };
  }
  return { frequency: 0.6, octaves: 1, edge: 0.15, blur: 0, block: 0 };
};

const createNoiseMask = (target: HTMLElement, kind: string, floor: number, extraBlur: number) => {
  const box = target.getBoundingClientRect();
  const { frequency, octaves, edge, blur, block } = noiseFor(kind, Math.sqrt(Math.max(box.width * box.height, 1)));
  const node = (name: string, attrs: Record<string, string | number>, parent: Element) => {
    const child = document.createElementNS(SVG_NS, name) as SVGElement;
    Object.entries(attrs).forEach(([key, value]) => child.setAttribute(key, String(value)));
    parent.appendChild(child);
    return child;
  };
  const svg = node('svg', { width: 0, height: 0, 'aria-hidden': 'true' }, document.body);
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  const id = `fade-content-mask-${(maskCount += 1)}`;
  const filter = node(
    'filter',
    { id, x: '-10%', y: '-10%', width: '120%', height: '120%', 'color-interpolation-filters': 'sRGB' },
    svg
  );
  node(
    'feTurbulence',
    {
      type: 'fractalNoise',
      baseFrequency: frequency,
      numOctaves: octaves,
      seed: Math.floor(Math.random() * 1000),
      result: 'noise'
    },
    filter
  );
  let source = 'noise';
  if (block > 0) {
    const dot = block / 2 - 1;
    node(
      'feColorMatrix',
      { in: 'noise', type: 'matrix', values: '1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1', result: 'gray' },
      filter
    );
    node('feFlood', { x: dot, y: dot, width: 2, height: 2, 'flood-color': '#000', result: 'dot' }, filter);
    node('feComposite', { in: 'dot', in2: 'dot', width: block, height: block, result: 'cell' }, filter);
    node('feTile', { in: 'cell', result: 'grid' }, filter);
    node('feComposite', { in: 'gray', in2: 'grid', operator: 'in', result: 'samples' }, filter);
    node('feMorphology', { in: 'samples', operator: 'dilate', radius: dot, result: 'blocks' }, filter);
    source = 'blocks';
  }
  node(
    'feColorMatrix',
    { in: source, type: 'matrix', values: '0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1.43 0 0 0 -0.21' },
    filter
  );
  const curve = node('feFuncA', { type: 'table' }, node('feComponentTransfer', { result: 'mask' }, filter));
  node('feComposite', { in: 'SourceGraphic', in2: 'mask', operator: 'in' }, filter);

  const url = `url(#${id})`;
  const blurFrom = blur + extraBlur;
  const state = { progress: 0 };
  let drawn = -1;

  const render = () => {
    const progress = state.progress;
    if (progress === drawn) return;
    drawn = progress;
    if (progress >= 1) {
      target.style.filter = '';
      target.style.visibility = 'inherit';
      return;
    }
    const front = progress * (1 + 2 * edge) - edge;
    curve.setAttribute(
      'tableValues',
      LEVELS.map(level => (floor + (1 - floor) * (1 - smoothstep(front - edge, front + edge, level))).toFixed(3)).join(
        ' '
      )
    );
    target.style.filter = blurFrom > 0 ? `${url} blur(${(blurFrom * (1 - progress)).toFixed(2)}px)` : url;
    target.style.visibility = progress <= 0 && floor <= 0 ? 'hidden' : 'inherit';
  };

  render();

  return {
    state,
    render,
    remove: () => {
      svg.remove();
      target.style.filter = '';
    }
  };
};

const getLooks = (effect: string, blur: number, initialOpacity: number): Look[] => {
  const soften = (amount: number) => `blur(${amount}px)`;
  if (effect === 'focus') {
    return [
      { from: { autoAlpha: initialOpacity }, to: { autoAlpha: 1 }, share: 0.6 },
      { from: { filter: soften(6 + blur) }, to: { filter: soften(0) }, share: 1 }
    ];
  }
  if (effect === 'develop') {
    return [
      { from: { autoAlpha: initialOpacity }, to: { autoAlpha: 1 }, share: 0.5 },
      {
        from: { filter: `grayscale(1) contrast(0.55) brightness(1.3) ${soften(blur)}` },
        to: { filter: `grayscale(0) contrast(1) brightness(1) ${soften(0)}` },
        share: 1
      }
    ];
  }
  if (blur > 0) {
    return [
      { from: { autoAlpha: initialOpacity, filter: soften(blur) }, to: { autoAlpha: 1, filter: soften(0) }, share: 1 }
    ];
  }
  return [{ from: { autoAlpha: initialOpacity }, to: { autoAlpha: 1 }, share: 1 }];
};

const FadeContent = ({
  children,
  container,
  effect = 'fade',
  blur = false,
  duration = 1,
  ease = 'power2.out',
  delay = 0,
  threshold = 0.1,
  initialOpacity = 0,
  stagger = 0,
  staggerFrom = 'start',
  trigger = 'scroll',
  once = true,
  exit = false,
  scrub = false,
  disappearAfter = 0,
  disappearDuration = 0.5,
  disappearEase = 'power2.in',
  onStart,
  onComplete,
  onDisappearanceComplete,
  className = '',
  style,
  ...props
}: FadeContentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const callbacksRef = useRef({ onStart, onComplete, onDisappearanceComplete });
  useEffect(() => {
    callbacksRef.current = { onStart, onComplete, onDisappearanceComplete };
  }, [onStart, onComplete, onDisappearanceComplete]);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const source: Element | string | null = container || document.getElementById('snap-main-container') || null;
    const scroller: Element | null = typeof source === 'string' ? document.querySelector(source) : source;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    let masks: ReturnType<typeof createNoiseMask>[] = [];
    let follow: gsap.core.Tween | null = null;

    const ctx = gsap.context(() => {
      const targets: HTMLElement[] =
        stagger > 0 && el.children.length ? (Array.from(el.children) as HTMLElement[]) : [el];
      gsap.set(el, { visibility: 'visible' });

      if (reduce) {
        callbacksRef.current.onComplete?.();
        return;
      }

      const seconds = Math.max(toSeconds(duration) || 0, 0.01);
      const blurAmount = blur === true ? 10 : Math.max(Number(blur) || 0, 0);
      const startOpacity = clamp01(Number(initialOpacity) || 0);
      const staggerVars: gsap.TweenVars =
        stagger > 0 ? { stagger: { each: toSeconds(stagger), from: staggerFrom } } : {};
      const noisy = NOISE_EFFECTS.includes(effect);
      const looks = noisy ? [] : getLooks(effect, blurAmount, startOpacity);

      if (noisy) masks = targets.map(target => createNoiseMask(target, effect, startOpacity, blurAmount));
      const proxies = masks.map(mask => mask.state);
      const draw = () => masks.forEach(mask => mask.render());

      const reveal = (timeline: gsap.core.Timeline, position: number) => {
        if (noisy) {
          timeline.fromTo(
            proxies,
            { progress: 0 },
            { progress: 1, duration: seconds, ease, ...staggerVars, onUpdate: draw },
            position
          );
          return;
        }
        looks.forEach(look =>
          timeline.fromTo(
            targets,
            look.from,
            { ...look.to, duration: seconds * look.share, ease, ...staggerVars },
            position
          )
        );
      };

      const conceal = (timeline: gsap.core.Timeline, vars: gsap.TweenVars) => {
        if (noisy) {
          timeline.to(proxies, { progress: 0, ...vars, onUpdate: draw }, 0);
          return;
        }
        looks.forEach(look => timeline.to(targets, { ...look.from, ...vars }, 0));
      };

      const settle = () => {
        if (noisy) {
          masks.forEach(mask => mask.remove());
          masks = [];
          return;
        }
        gsap.set(targets, { clearProps: 'filter,transform' });
      };

      const scrubbing = scrub && trigger !== 'mount';
      const replaying = !once || exit;
      const disappearing = disappearAfter > 0 && !replaying && !scrubbing;

      const tl = gsap.timeline({
        paused: true,
        onStart: () => callbacksRef.current.onStart?.(),
        onComplete: () => {
          callbacksRef.current.onComplete?.();
          if (scrubbing) return;
          if (disappearing) {
            const out = gsap.timeline({
              delay: toSeconds(disappearAfter),
              onComplete: () => callbacksRef.current.onDisappearanceComplete?.()
            });
            conceal(out, {
              duration: Math.max(toSeconds(disappearDuration) || 0, 0.01),
              ease: disappearEase,
              ...staggerVars
            });
            return;
          }
          if (!replaying || !noisy) settle();
        }
      });
      reveal(tl, scrubbing ? 0 : Math.max(toSeconds(delay) || 0, 0));

      if (trigger === 'mount') {
        tl.play();
        return;
      }

      const measure = () => {
        const view = scroller ? scroller.getBoundingClientRect() : { top: 0, height: window.innerHeight };
        const scrolled = scroller ? scroller.scrollTop : window.scrollY;
        const box = el.getBoundingClientRect();
        return {
          height: view.height,
          scrolled,
          limit: scroller
            ? scroller.scrollHeight - scroller.clientHeight
            : document.documentElement.scrollHeight - window.innerHeight,
          top: box.top - view.top + scrolled,
          bottom: box.bottom - view.top + scrolled
        };
      };

      if (scrubbing) {
        const smoothing = scrub === true ? 0 : Math.max(Number(scrub) || 0, 0);
        const update = () => {
          const { height, scrolled, limit, top, bottom } = measure();
          const zone = height * Math.min(Math.max((1 - 2 * threshold) * 0.4, 0.05), 0.4);
          const revealed = Math.min(top - height * (1 - threshold) + zone, limit);
          let visible = clamp01((scrolled - revealed) / zone + 1);
          if (exit) {
            const outStart = Math.max(bottom - height * threshold - zone, 0);
            const outEnd = Math.max(bottom - height * threshold, outStart + zone / 2);
            visible = Math.min(visible, 1 - clamp01((scrolled - outStart) / (outEnd - outStart)));
          }
          visible = Math.round(visible * 1000) / 1000;
          if (smoothing > 0) {
            follow = gsap.to(tl, { progress: visible, duration: smoothing, ease: 'power3.out', overwrite: true });
          } else {
            tl.progress(visible);
          }
        };
        ScrollTrigger.create({
          trigger: el,
          scroller,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: update,
          onRefresh: update
        });
        update();
        return;
      }

      ScrollTrigger.create({
        trigger: el,
        scroller,
        start: () => {
          const { height, limit, top } = measure();
          const start = top - height * (1 - threshold);
          return start > limit ? limit - 1 : start;
        },
        end: exit ? `bottom ${threshold * 100}%` : undefined,
        once: !replaying,
        onEnter: () => tl.play(),
        onLeave: exit ? () => tl.reverse() : undefined,
        onEnterBack: exit ? () => tl.play() : undefined,
        onLeaveBack: once ? undefined : () => tl.reverse()
      });
    }, el);

    return () => {
      follow?.kill();
      ctx.revert();
      masks.forEach(mask => mask.remove());
    };
  }, [
    container,
    effect,
    blur,
    duration,
    ease,
    delay,
    threshold,
    initialOpacity,
    stagger,
    staggerFrom,
    trigger,
    once,
    exit,
    scrub,
    disappearAfter,
    disappearDuration,
    disappearEase
  ]);

  return (
    <div ref={ref} className={className} style={style} {...props}>
      {children}
    </div>
  );
};

export default FadeContent;
