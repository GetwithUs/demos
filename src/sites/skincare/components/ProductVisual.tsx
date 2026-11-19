import { useId } from "react";
import { cn } from "@/lib/cn";
import type { ProductVisualSpec } from "@/sites/skincare/data/types";

/**
 * A clean studio-style render of a product pack, drawn in SVG from the product's visual spec,
 * so every product has a consistent, sharp image without stock photos. Fills its container
 * width at a 4:5 ratio; place it on a tile coloured with `spec.tint`.
 */
export default function ProductVisual({
  spec,
  name,
  className,
}: {
  spec: ProductVisualSpec;
  /** Product name, for the accessible label. */
  name: string;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  const lines = spec.label.split("\n").slice(0, 2);

  return (
    <svg
      viewBox="0 0 240 300"
      role="img"
      aria-label={`${name}, product pack`}
      className={cn("block h-auto w-full", className)}
    >
      <defs>
        <linearGradient id={`gloss-${id}`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.18" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="0.75" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.12" />
        </linearGradient>
        <radialGradient id={`shadow-${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#000" stopOpacity="0.22" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="270" rx="78" ry="9" fill={`url(#shadow-${id})`} />
      <Pack spec={spec} gloss={`url(#gloss-${id})`} lines={lines} />
    </svg>
  );
}

function Label({
  x,
  y,
  width,
  height,
  spec,
  lines,
  size = 12,
  radius = 0,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  spec: ProductVisualSpec;
  lines: string[];
  size?: number;
  radius?: number;
}) {
  const cx = x + width / 2;
  const top = y + height / 2 - (lines.length * size * 1.2) / 2 + size * 0.95;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={radius} fill={spec.labelBg} />
      <text
        x={cx}
        y={y + 15}
        textAnchor="middle"
        fontSize={size * 0.62}
        letterSpacing={size * 0.22}
        fontWeight={700}
        fill={spec.labelInk}
        opacity={0.8}
      >
        ORUVI
      </text>
      {lines.map((line, i) => (
        <text
          key={line}
          x={cx}
          y={top + 6 + i * size * 1.2}
          textAnchor="middle"
          fontSize={size}
          fontWeight={i === 0 ? 700 : 500}
          fill={spec.labelInk}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function Pack({ spec, gloss, lines }: { spec: ProductVisualSpec; gloss: string; lines: string[] }) {
  switch (spec.shape) {
    case "dropper":
      return (
        <g>
          <rect x="106" y="34" width="28" height="56" rx="14" fill={spec.cap} />
          <rect x="94" y="84" width="52" height="26" rx="5" fill={spec.cap} />
          <rect x="94" y="84" width="52" height="26" rx="5" fill={gloss} />
          <rect x="102" y="108" width="36" height="14" rx="3" fill={spec.body} />
          <rect x="74" y="118" width="92" height="146" rx="16" fill={spec.body} />
          {spec.liquid ? (
            <rect
              x="80"
              y="150"
              width="80"
              height="108"
              rx="12"
              fill={spec.liquid}
              opacity="0.75"
            />
          ) : null}
          <Label x={74} y={168} width={92} height={66} spec={spec} lines={lines} size={11.5} />
          <rect x="74" y="118" width="92" height="146" rx="16" fill={gloss} />
        </g>
      );
    case "pump":
      return (
        <g>
          <rect x="100" y="52" width="40" height="22" rx="6" fill={spec.cap} />
          <rect x="136" y="56" width="34" height="9" rx="4.5" fill={spec.cap} />
          <rect x="110" y="72" width="20" height="22" fill={spec.cap} />
          <rect x="98" y="92" width="44" height="20" rx="5" fill={spec.cap} />
          <rect x="76" y="108" width="88" height="158" rx="22" fill={spec.body} />
          <Label x={76} y={156} width={88} height={72} spec={spec} lines={lines} size={11} />
          <rect x="76" y="108" width="88" height="158" rx="22" fill={gloss} />
        </g>
      );
    case "tube":
      return (
        <g>
          <rect x="76" y="34" width="88" height="14" rx="2" fill={spec.body} />
          <path d="M80 48 H160 L150 226 Q120 234 90 226 Z" fill={spec.body} />
          <path d="M80 48 H160 L150 226 Q120 234 90 226 Z" fill={gloss} />
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x={82 + i * 22}
              y="37"
              width="10"
              height="8"
              rx="1"
              fill="#000"
              opacity="0.06"
            />
          ))}
          <text
            x="120"
            y="96"
            textAnchor="middle"
            fontSize="8"
            letterSpacing="2.6"
            fontWeight={700}
            fill={spec.labelInk}
            opacity={0.8}
          >
            ORUVI
          </text>
          {lines.map((line, i) => (
            <text
              key={line}
              x="120"
              y={124 + i * 15}
              textAnchor="middle"
              fontSize="12"
              fontWeight={i === 0 ? 700 : 500}
              fill={spec.labelInk}
            >
              {line}
            </text>
          ))}
          <rect x="102" y="160" width="36" height="2" rx="1" fill={spec.labelInk} opacity="0.35" />
          <rect x="92" y="226" width="56" height="38" rx="7" fill={spec.cap} />
          <rect x="92" y="226" width="56" height="38" rx="7" fill={gloss} />
        </g>
      );
    case "jar":
      return (
        <g>
          <rect x="58" y="144" width="124" height="38" rx="9" fill={spec.cap} />
          <rect x="58" y="144" width="124" height="38" rx="9" fill={gloss} />
          <rect x="64" y="178" width="112" height="88" rx="18" fill={spec.body} />
          <Label x={64} y={196} width={112} height={52} spec={spec} lines={lines} size={11} />
          <rect x="64" y="178" width="112" height="88" rx="18" fill={gloss} />
        </g>
      );
    case "mist":
      return (
        <g>
          <rect x="102" y="48" width="36" height="34" rx="7" fill={spec.cap} />
          <circle cx="130" cy="62" r="3" fill="#000" opacity="0.25" />
          <rect x="106" y="80" width="28" height="24" rx="3" fill={spec.cap} />
          <rect x="82" y="102" width="76" height="164" rx="14" fill={spec.body} />
          {spec.liquid ? (
            <rect
              x="88"
              y="128"
              width="64"
              height="132"
              rx="10"
              fill={spec.liquid}
              opacity="0.75"
            />
          ) : null}
          <Label x={82} y={160} width={76} height={68} spec={spec} lines={lines} size={10.5} />
          <rect x="82" y="102" width="76" height="164" rx="14" fill={gloss} />
        </g>
      );
    case "stick":
      return (
        <g>
          <rect x="98" y="62" width="44" height="62" rx="9" fill={spec.cap} />
          <rect x="98" y="62" width="44" height="62" rx="9" fill={gloss} />
          <rect x="96" y="120" width="48" height="146" rx="10" fill={spec.body} />
          <text
            x="120"
            y="160"
            textAnchor="middle"
            fontSize="6.5"
            letterSpacing="2"
            fontWeight={700}
            fill={spec.labelInk}
            opacity={0.8}
          >
            ORUVI
          </text>
          {lines.map((line, i) => (
            <text
              key={line}
              x="120"
              y={182 + i * 11}
              textAnchor="middle"
              fontSize="8.5"
              fontWeight={i === 0 ? 700 : 500}
              fill={spec.labelInk}
            >
              {line}
            </text>
          ))}
          <rect x="96" y="120" width="48" height="146" rx="10" fill={gloss} />
        </g>
      );
    case "box":
      return (
        <g>
          <path d="M52 96 L76 78 H200 L184 96 Z" fill={spec.body} />
          <path d="M52 96 L76 78 H200 L184 96 Z" fill="#000" opacity="0.06" />
          <path d="M184 96 L200 78 V246 L184 266 Z" fill={spec.body} />
          <path d="M184 96 L200 78 V246 L184 266 Z" fill="#000" opacity="0.14" />
          <rect x="52" y="96" width="132" height="170" rx="3" fill={spec.body} />
          <Label x={52} y={150} width={132} height={70} spec={spec} lines={lines} size={13} />
          <rect x="52" y="96" width="132" height="170" rx="3" fill={gloss} />
        </g>
      );
  }
}
