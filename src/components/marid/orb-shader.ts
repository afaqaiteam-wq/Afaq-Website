/*
 * Marid's orb: the AGSL shader that ships in the Android app (life-agent repo, tools/orb/orb.agsl,
 * also pasted at the end of ui/MaridCore.kt), copied here unchanged. It runs in WebGL 1 through the
 * same translation as the app's own browser preview (tools/orb/preview.py): a few #defines, a texture
 * lookup for the smoke and a small main(). To update it, paste the new orb.agsl over AGSL below.
 */

const AGSL = `
// Marid, after his logo: a midnight-glass orb full of stars with two glowing crescent eyes, the genie's golden
// smoke from the logo itself (kept flowing upward, fading into a tail instead of the lamp: he flies), and the
// logo's gold/blue rings with diamond marks around him.
// AGSL (Android 13+). Pixel y grows downwards; in "orb units" the glass has radius 1.
uniform float2 iResolution;   // canvas size, px
uniform float iTime;          // seconds
uniform float4 uPhase;        // listening, thinking, speaking, error: 0..1 each, cross-faded by the caller
uniform float4 uFace;         // voice level 0..1, blink 0..1 (1 = closed), gaze x, gaze y (orb units)
uniform float4 uLayout;       // orb centre x, y (share of the canvas), orb radius (share of its width), detail 0..1
uniform shader smoke;         // the logo's smoke on black (marid_smoke)
uniform float4 uSmoke;        // orb centre x, y and orb radius in the smoke image's pixels; flow speed

float hash21(float2 p) {
    float3 p3 = fract(float3(p.x, p.y, p.x) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float vnoise(float2 p) {
    float2 i = floor(p);
    float2 f = fract(p);
    float2 u = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + float2(1.0, 0.0));
    float c = hash21(i + float2(0.0, 1.0));
    float d = hash21(i + float2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(float2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
        v += a * vnoise(p);
        p = float2(p.x * 1.6 + p.y * 1.2, p.y * 1.6 - p.x * 1.2) + float2(1.7, 9.2);
        a *= 0.5;
    }
    return v;
}

float2 turn(float2 p, float a) {
    float c = cos(a);
    float s = sin(a);
    return float2(c * p.x - s * p.y, s * p.x + c * p.y);
}

// A ring of radius r0 and half-width w, anti-aliased over aa.
float ring(float r, float r0, float w, float aa) {
    return 1.0 - smoothstep(w, w + aa, abs(r - r0));
}

// 1 between the angles a0 and a1 (radians from the top, clockwise), soft ends.
float span(float th, float a0, float a1) {
    return smoothstep(a0, a0 + 0.02, th) * (1.0 - smoothstep(a1 - 0.02, a1, th));
}

// A four-point star (the logo's diamonds and glints), size s.
float sparkle(float2 q, float s) {
    float2 a = abs(q) / s;
    return exp(-a.x * 7.0 - a.y * 1.6) + exp(-a.y * 7.0 - a.x * 1.6) + exp(-(a.x + a.y) * 4.0);
}

// One eye, as in the logo: a moon whose underside is cut by a bigger circle, leaving a wide crescent with
// pointed ends. Returns (moon, cut) distances. The cut drops when he listens (wide awake), pulses while Marid
// speaks and rises to close the eye when he blinks; when something failed the eye thins and its outer end
// droops (sorry, not angry). side = -1 left, +1 right.
float2 eyeParts(float2 p, float side) {
    float lv = uFace.x;
    float listen = uPhase.x;
    float think = uPhase.y;
    float speak = uPhase.z;
    float err = uPhase.w;
    float2 q = p - (float2(0.375 * side, 0.065 - 0.03 * speak * lv) + uFace.zw);
    q = turn(q, -0.42 * side * err);
    float drop = (0.27 + 0.11 * listen + 0.05 * think + 0.04 * speak * lv - 0.05 * err) * (1.0 - 0.92 * uFace.y);
    return float2(length(q) - 0.225, length(q - float2(0.0, drop)) - 0.3);
}

// The genie's smoke, alive: two copies of the logo's smoke drift upward through a slow noise field and
// cross-fade, so it flows forever without jumping (a flow-map loop).
float3 smokeAt(float2 p, float t) {
    float2 base = uSmoke.xy + p * uSmoke.z;
    float2 n = float2(fbm(p * 2.0 + float2(0.0, t * 0.22)), fbm(p * 2.0 + float2(5.1, -t * 0.18))) - 0.5;
    float2 flow = float2(n.x * 0.8, -1.0 + n.y * 0.6) * uSmoke.z * 0.06;
    float2 wob = n * uSmoke.z * 0.035;
    float ph = fract(t * uSmoke.w);
    float3 a = smoke.eval(base + flow * (ph - 0.5) + wob).rgb;
    float3 b = smoke.eval(base + flow * (fract(ph + 0.5) - 0.5) + wob).rgb;
    return mix(b, a, 1.0 - abs(2.0 * ph - 1.0));
}

half4 main(float2 fragCoord) {
    float W = iResolution.x;
    float H = iResolution.y;
    float R = uLayout.z * W;
    float2 p = (fragCoord - float2(uLayout.x * W, uLayout.y * H)) / R;
    float r = length(p);
    float detail = uLayout.w;
    float edge = clamp(min(min(fragCoord.x, W - fragCoord.x), min(fragCoord.y, H - fragCoord.y)) / (0.04 * W), 0.0, 1.0);
    if (edge <= 0.0 || (detail <= 0.0 && r > 2.3)) {
        return half4(0.0);
    }
    float aa = 1.5 / R;
    float t = iTime;
    float listen = uPhase.x;
    float think = uPhase.y;
    float speak = uPhase.z;
    float err = uPhase.w;
    float lv = uFace.x;
    float idle = clamp(1.0 - listen - think - speak - err, 0.0, 1.0);
    float energy = 0.24 + 0.06 * sin(t * 1.6) * idle + (0.2 + 0.8 * lv) * (listen + speak) * 0.8 + 0.3 * think;
    energy *= 1.0 - 0.5 * err;

    float3 gold = mix(float3(1.0, 0.72, 0.22), float3(1.0, 0.40, 0.33), err);
    float3 amber = mix(float3(1.0, 0.55, 0.1), float3(0.85, 0.22, 0.16), err);
    float3 hot = mix(float3(1.0, 0.93, 0.62), float3(1.0, 0.78, 0.7), err);
    float3 blue = mix(float3(0.25, 0.7, 1.0), float3(0.5, 0.3, 0.32), err);

    // ---- The glass orb.
    float inside = 1.0 - smoothstep(1.0 - aa, 1.0 + aa, r);
    float3 col = float3(0.0);
    if (inside > 0.0) {
        float z = sqrt(max(1.0 - r * r, 0.0));
        float2 dir = p / max(r, 0.001);
        col = mix(float3(0.003, 0.007, 0.024), float3(0.02, 0.05, 0.13), smoothstep(0.1, 1.0, r));
        col += float3(0.015, 0.04, 0.12) * smoothstep(0.45, 0.9, fbm(turn(p, t * 0.03) * 2.2 + float2(t * 0.02, 0.0)));
        // Stars and specks of light, twinkling.
        float2 sg = turn(p, t * 0.015) * 13.0;
        float2 cell = floor(sg);
        float h = hash21(cell);
        float2 sp = fract(sg) - 0.5 - (float2(hash21(cell + 7.1), hash21(cell + 3.3)) - 0.5) * 0.6;
        float tw = 0.5 + 0.5 * sin(t * (1.2 + 3.0 * h) + h * 40.0);
        col += mix(float3(0.7, 0.82, 1.0), hot, step(0.96, h)) * step(0.86, h) * exp(-dot(sp, sp) * 230.0) * tw;
        // The glass: blue light on the right edge, gold where the smoke lights it from the left and below,
        // a soft window reflection on the upper left, a four-point glint.
        float fres = pow(1.0 - z, 2.4);
        float right = smoothstep(-0.1, 0.8, dot(dir, float2(0.9, -0.2)));
        col += mix(gold, float3(0.3, 0.6, 1.0), right) * fres * (0.6 + 0.25 * energy);
        float band = smoothstep(0.78, 0.92, r) * (1.0 - smoothstep(0.92, 0.995, r));
        col += float3(0.35, 0.68, 1.0) * band * smoothstep(0.1, 0.85, dot(dir, float2(0.85, -0.35))) * 0.9;
        col += float3(0.85, 0.95, 1.0) * ring(r, 0.975, 0.006, aa) * smoothstep(0.3, 0.9, dot(dir, float2(0.8, -0.5)));
        float2 g = (p - float2(-0.42, -0.5)) * float2(1.0, 1.5);
        col += float3(0.7, 0.82, 1.0) * exp(-dot(g, g) * 14.0) * smoothstep(0.55, 0.85, r) * 0.22;
        col += float3(0.85, 0.92, 1.0) * sparkle(p - float2(0.38, -0.5), 0.07) * (0.5 + 0.3 * sin(t * 1.3)) * 0.35;
        // Eyes: pale gold inside, a deep orange glow above them only. Glow below the crescent drew a full circle
        // there and read as an eye looking down.
        float2 el = eyeParts(p, -1.0);
        float2 er = eyeParts(p, 1.0);
        float d = min(max(el.x, -el.y), max(er.x, -er.y));
        float fill = 1.0 - smoothstep(-aa, aa, d);
        float core = 1.0 - smoothstep(-0.08, -0.015, d);
        col = mix(col, mix(float3(1.0, 0.82, 0.32), float3(1.0, 0.97, 0.8), core) * (0.98 + 0.2 * energy), fill);
        float horns = 0.11 - 0.03 * speak * lv + uFace.w;
        float above = 1.0 - smoothstep(horns - 0.12, horns, p.y);
        col += float3(1.0, 0.6, 0.12) * exp(-max(d, 0.0) * 16.0) * above * (1.0 - fill) * (1.0 + 0.4 * energy);
        col = clamp(col, 0.0, 1.0) * inside;
    }

    // ---- Light outside the glass: a warm halo and a blue breath on the right.
    float outside = 1.0 - inside;
    float rr = max(r - 1.0, 0.0);
    float3 light = gold * (exp(-rr * 3.0) * 0.07 + exp(-rr * 10.0) * 0.15) * (0.6 + 1.2 * energy) * outside;
    light += blue * exp(-rr * 8.0) * 0.12 * smoothstep(-0.2, 0.8, p.x - 0.3 * p.y) * outside;

    if (detail > 0.0) {
        // ---- The genie's smoke, with light pulses rising through it and a few fresh sparks.
        if (p.y > -1.2) {
            float3 sm = smokeAt(p, t);
            sm *= 0.82 + 0.3 * (0.5 + 0.5 * sin(p.y * 6.5 + t * 2.2 + p.x * 1.5));
            sm *= mix(float3(1.0), float3(1.0, 0.55, 0.5), err);
            float2 sg2 = float2(p.x * 9.0, p.y * 9.0 + t * 0.6);
            float2 c2 = floor(sg2);
            float h2 = hash21(c2 + 11.0);
            float2 sp2 = fract(sg2) - 0.5 - (float2(hash21(c2 + 1.3), hash21(c2 + 5.7)) - 0.5) * 0.7;
            float spark = step(0.86, h2) * exp(-dot(sp2, sp2) * 300.0) * (0.45 + 0.55 * sin(t * 3.0 + h2 * 50.0));
            sm += hot * spark * smoothstep(0.02, 0.2, sm.r + sm.g);
            sm *= 0.95 + 0.5 * energy;
            col += sm * inside;
            light += sm * outside;
        }

        // ---- The logo's rings, centred a little below the orb: thin gold arcs on top, cyan arcs and dotted
        // arcs on the sides that turn slowly (faster while thinking), short thick gold bars, a faint full circle,
        // four-point diamonds left and right, and a hollow diamond on a hairline at the top.
        float2 q = p - float2(0.0, 0.34);
        float rq = length(q);
        float th = atan(q.x, -q.y);                          // 0 at the top, clockwise, -pi..pi
        float swell = 0.05 * listen * lv;
        float spin = t * (0.05 + 0.6 * think);
        float3 hud = float3(0.0);
        hud += gold * ring(rq, 1.7 + swell, 0.0055, aa) * (span(th, -1.1, -0.2) + span(th, 0.38, 1.1));
        hud += float3(0.4, 0.45, 0.55) * ring(rq, 1.76 + swell, 0.003, aa) * 0.35 * span(abs(th), 0.0, 1.2);
        float tb = mod(th + spin + 3.14159, 6.28318) - 3.14159;
        hud += blue * ring(rq, 1.53 + swell * 1.6, 0.009, aa) * (span(tb, -1.95, -1.25) + span(tb, -2.45, -2.1)
            + span(tb, 1.0, 1.45) + span(tb, 1.75, 2.1)) * 1.1;
        float n = 72.0;
        float tc = mod(th - spin * 0.6 + 3.14159, 6.28318) - 3.14159;
        float cellA = (fract(tc * n / 6.28318) - 0.5) * 6.28318 / n * 1.62;
        float dots = 1.0 - smoothstep(0.008, 0.008 + aa, length(float2(cellA, rq - 1.62 - swell)));
        hud += blue * dots * (span(tc, -0.95, -0.6) + span(tc, 0.6, 0.98) + span(tc, 2.55, 2.9));
        hud += gold * ring(rq, 1.8 + swell, 0.016, aa) * (span(th, -1.42, -1.2) + span(th, 1.2, 1.42) + span(th, 2.22, 2.45));
        hud += gold * (ring(rq, 1.64 + swell, 0.004, aa) + ring(rq, 1.67 + swell, 0.004, aa)) * span(th, -2.6, -2.15);
        hud += hot * sparkle(float2(abs(q.x) - 1.7 - swell, q.y), 0.06) * (0.75 + 0.25 * sin(t * 1.7));
        float2 dq = float2(q.x, q.y + 1.7 + swell);
        float diamond = ring(abs(dq.x) + abs(dq.y), 0.05, 0.007, aa);
        diamond += (1.0 - smoothstep(0.003, 0.003 + aa, abs(q.x)))
            * (span(-q.y, 1.76 + swell, 2.05) + span(-q.y, 1.5, 1.64) * step(0.5, fract(q.y * 30.0)));
        hud += hot * diamond * 0.9;
        float bloom = exp(-abs(rq - 1.62) * 9.0) * 0.06;
        light += (hud * 1.35 + gold * bloom) * (0.7 + 0.35 * energy + 0.35 * listen) * (1.0 - 0.35 * err) * outside;
    }

    // Listening: ripples leave the glass with his voice. Thinking: a comet circles the glass.
    if (listen > 0.0) {
        for (int i = 0; i < 3; i++) {
            float k = fract(t * 0.55 + float(i) / 3.0);
            light += gold * exp(-abs(r - 1.04 - 0.4 * k) * 60.0) * (1.0 - k) * listen * (0.1 + 0.6 * lv) * outside;
        }
    }
    if (think > 0.0) {
        float behind = mod(t * 2.4 - atan(p.y, p.x) + 62.8318, 6.28318);
        light += hot * exp(-abs(r - 1.12) * 75.0) * exp(-behind * 2.4) * think * 1.4 * outside;
    }

    light = clamp(light * edge, 0.0, 1.0);
    col = clamp(col, 0.0, 1.0);
    float alpha = clamp(inside + max(light.r, max(light.g, light.b)), 0.0, 1.0);
    return half4(float4(col + light, alpha));
}
`;

export const ORB_FRAGMENT =
  `precision highp float;
#define float2 vec2
#define float3 vec3
#define float4 vec4
#define half float
#define half2 vec2
#define half3 vec3
#define half4 vec4
` +
  AGSL.replace("half4 main(float2 fragCoord)", "half4 agslMain(float2 fragCoord)")
    .replace(
      "uniform shader smoke;",
      "uniform sampler2D smokeTex; uniform vec2 uSmokeSize;\nvec4 smokeEval(vec2 c) { return texture2D(smokeTex, c / uSmokeSize); }",
    )
    .replaceAll("smoke.eval(", "smokeEval(") +
  "\nvoid main() { gl_FragColor = agslMain(vec2(gl_FragCoord.x, iResolution.y - gl_FragCoord.y)); }\n";

export const ORB_VERTEX = "attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }";
