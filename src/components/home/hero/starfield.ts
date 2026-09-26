import { stamp } from "./glow";
import { TAU, clamp } from "./timeline";

/*
 * A 3D starfield flying towards the viewer. Stars live in a box in front of the camera
 * (x, y in about -1.3..1.3, z in 0..1 where 0 is the camera) and move closer every frame.
 * At high speed each star is drawn as a streak from its position a moment ago, which gives
 * the warp effect; at idle speed they are points drifting slowly outwards.
 */

type Star = { x: number; y: number; z: number; tint: number; tw: number };

const TINTS = ["255,255,255", "228,216,255", "206,220,255"];

export class Starfield {
  private stars: Star[] = [];
  private seed = 7;

  private rnd() {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  private place(star: Star, z: number) {
    star.x = (this.rnd() * 2 - 1) * 1.3;
    star.y = (this.rnd() * 2 - 1) * 1.3;
    star.z = z;
  }

  resize(count: number) {
    this.seed = 7;
    this.stars = Array.from({ length: count }, () => {
      const s: Star = { x: 0, y: 0, z: 1, tint: 0, tw: 0 };
      // never start right in front of the camera: a static near star reads as a stray orb
      this.place(s, 0.18 + this.rnd() * 0.82);
      const r = this.rnd();
      s.tint = r < 0.7 ? 0 : r < 0.86 ? 1 : 2;
      s.tw = this.rnd() * TAU;
      return s;
    });
  }

  /**
   * @param speed  depth units per second (idle ≈ 0.03, warp ≈ 1.5+)
   * @param dim    overall brightness multiplier (lowered while the constellation is on screen)
   */
  draw(
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    vx: number,
    vy: number,
    t: number,
    dt: number,
    speed: number,
    dim: number,
    sprite: HTMLCanvasElement,
  ) {
    const f = Math.max(W, H) * 0.42;
    const streak = speed > 0.14;
    // tail length in depth units: how far the star travelled over the last ~50ms
    const tail = Math.min(0.5, speed * 0.05);

    for (const s of this.stars) {
      s.z -= speed * dt;
      if (s.z <= 0.03) this.place(s, 1);

      const x = vx + (s.x / s.z) * f;
      const y = vy + (s.y / s.z) * f;
      if (x < -60 || x > W + 60 || y < -60 || y > H + 60) {
        this.place(s, 1);
        continue;
      }

      const near = 1 - s.z;
      const size = 0.35 + near * near * 2.3;
      const fadeIn = clamp(near / 0.3);
      const twinkle = streak ? 1 : 0.72 + 0.28 * Math.sin(t * 1.6 + s.tw);
      const a = fadeIn * twinkle * dim * (0.3 + 0.7 * near);
      if (a < 0.01) continue;

      if (streak) {
        const tz = Math.min(1, s.z + tail);
        const tx = vx + (s.x / tz) * f;
        const ty = vy + (s.y / tz) * f;
        ctx.strokeStyle = `rgba(${TINTS[s.tint]},${a.toFixed(3)})`;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (size < 1.1) {
        ctx.fillStyle = `rgba(${TINTS[s.tint]},${a.toFixed(3)})`;
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      } else {
        ctx.fillStyle = `rgba(${TINTS[s.tint]},${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.55, 0, TAU);
        ctx.fill();
        if (near > 0.8 && speed > 0.001) stamp(ctx, sprite, x, y, size * 2.4, a * 0.28);
      }
    }
  }
}
