import { useEffect, useRef } from "react";

export type AnimationPlugin = (timestamp: number, elapsed: number) => void;

export function useMapAnimation(
  register: (registerFn: (plugin: AnimationPlugin) => void) => void
) {
  const pluginsRef = useRef<AnimationPlugin[]>([]);
  const lastTimestampRef = useRef<number>(0);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    register((plugin: AnimationPlugin) => {
      pluginsRef.current.push(plugin);
    });

    const animate = (timestamp: number) => {
      const last = lastTimestampRef.current || timestamp;
      const elapsed = timestamp - last;
      lastTimestampRef.current = timestamp;

      for (const plugin of pluginsRef.current) {
        plugin(timestamp, elapsed);
      }

      frameIdRef.current = requestAnimationFrame(animate);
    };

    frameIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
    };
  }, [register]);
}
