import type { SVGProps } from "react";
import type { ToothIconName } from "@/sites/dental-clinic/content/treatments";

const TOOTH =
  "M8.2 3.2c-2.5 0-4.4 1.9-4.4 4.6 0 1.9.7 3.2 1.2 4.6.5 1.5.6 3.3.9 5.1.3 2 .9 3.3 2 3.3 1.3 0 1.6-1.6 1.9-3.4.3-1.6.8-2.6 2.2-2.6s1.9 1 2.2 2.6c.3 1.8.6 3.4 1.9 3.4 1.1 0 1.7-1.3 2-3.3.3-1.8.4-3.6.9-5.1.5-1.4 1.2-2.7 1.2-4.6 0-2.7-1.9-4.6-4.4-4.6-1.6 0-2.5.8-3.8.8s-2.2-.8-3.8-.8z";

type IconProps = SVGProps<SVGSVGElement>;

function Svg({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/** Line icons drawn for the site, one per kind of treatment, in the same style as lucide. */
export function ToothIcon({ name, ...props }: IconProps & { name: ToothIconName }) {
  switch (name) {
    case "checkup":
      return (
        <Svg {...props}>
          <path d={TOOTH} />
          <path d="M9.3 8.6l1.8 1.8 3.6-3.7" />
        </Svg>
      );
    case "filling":
      return (
        <Svg {...props}>
          <path d={TOOTH} />
          <path
            d="M10 7.6c.6-.9 3.4-.9 4 0 .5.8-.3 2.4-2 2.4s-2.5-1.6-2-2.4z"
            fill="currentColor"
          />
        </Svg>
      );
    case "root-canal":
      return (
        <Svg {...props}>
          <path d={TOOTH} />
          <path d="M9.4 9.2l.6 7.6M14.6 9.2l-.6 7.6" strokeDasharray="1.6 1.4" />
        </Svg>
      );
    case "braces":
      return (
        <Svg {...props}>
          <path d={TOOTH} />
          <path d="M2.2 10.2h19.6" />
          <rect x="9.8" y="8.6" width="4.4" height="3.2" rx="0.7" fill="currentColor" />
        </Svg>
      );
    case "implant":
      return (
        <Svg {...props}>
          <path d="M7.4 2.8c-2 0-3.4 1.5-3.4 3.5 0 1.4.5 2.5 1 3.6h14c.5-1.1 1-2.2 1-3.6 0-2-1.4-3.5-3.4-3.5-1.5 0-2.4.7-4.6.7s-3.1-.7-4.6-.7z" />
          <path d="M10 9.9v2h4v-2" />
          <path d="M10.4 11.9l.6 9h2l.6-9" />
          <path d="M9.8 14.2h4.4M10.1 16.5h3.8M10.4 18.8h3.2" />
        </Svg>
      );
    case "crown":
      return (
        <Svg {...props}>
          <path d={TOOTH} />
          <path d="M4.4 11.2c2.4.9 5 1.3 7.6 1.3s5.2-.4 7.6-1.3" />
          <path d="M8.5 5.8l1.4 1.6L12 5.4l2.1 2 1.4-1.6" />
        </Svg>
      );
    case "whitening":
      return (
        <Svg {...props}>
          <path d="M7.4 4.4c-2.2.2-3.6 1.9-3.6 4.2 0 1.8.7 3 1.2 4.4.5 1.5.6 3.2.9 4.9.3 1.9.9 3.1 1.9 3.1 1.3 0 1.6-1.5 1.9-3.3.3-1.5.8-2.5 2.2-2.5s1.9 1 2.2 2.5c.3 1.8.6 3.3 1.9 3.3 1 0 1.6-1.2 1.9-3.1.3-1.7.4-3.4.9-4.9.3-.8.6-1.5.9-2.3" />
          <path d="M7.4 4.4c1.3 0 2.3.7 3.5.7.6 0 1.1-.1 1.6-.3" />
          <path d="M18.5 2v5M16 4.5h5M14.6 9.3v2.4M13.4 10.5h2.4" />
        </Svg>
      );
    case "veneers":
      return (
        <Svg {...props}>
          <path d="M2.5 9.5c2.6 4.6 5.8 6.8 9.5 6.8s6.9-2.2 9.5-6.8" />
          <path d="M2.5 9.5c3 1.1 6.2 1.7 9.5 1.7s6.5-.6 9.5-1.7" />
          <path d="M8 10.9v2.9M12 11.2v3.6M16 10.9v2.9" />
          <path d="M19 3v3M17.5 4.5h3" />
        </Svg>
      );
    case "kids":
      return (
        <Svg {...props}>
          <path d={TOOTH} />
          <circle cx="9.8" cy="7.8" r="0.7" fill="currentColor" stroke="none" />
          <circle cx="14.2" cy="7.8" r="0.7" fill="currentColor" stroke="none" />
          <path d="M10 10.3c1.2 1 2.8 1 4 0" />
        </Svg>
      );
    case "wisdom":
      return (
        <Svg {...props}>
          <g transform="rotate(-16 12 12)">
            <path d={TOOTH} />
          </g>
          <path d="M2 17.5c3.5-1.2 6.5-1.2 10 0s6.5 1.2 10 0" />
        </Svg>
      );
    case "emergency":
      return (
        <Svg {...props}>
          <path d={TOOTH} />
          <path d="M13 5.6l-2.4 3.6h2.8l-2.4 3.6" />
        </Svg>
      );
  }
}

/** A chat bubble with a handset: the WhatsApp idea without copying its logo. */
export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M3.4 20.6l1.3-4.2a8.7 8.7 0 1 1 3.3 3.1z"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <path
        d="M9 8.5c0-.5.4-.9.9-.9h.6c.3 0 .5.2.6.4l.5 1.3c.1.3 0 .6-.2.8l-.5.4c.5 1 1.3 1.8 2.3 2.3l.4-.5c.2-.2.5-.3.8-.2l1.3.5c.2.1.4.3.4.6v.6c0 .5-.4.9-.9.9A6.1 6.1 0 0 1 9 8.5z"
        fill="currentColor"
      />
    </svg>
  );
}

/** The studio's mark: a tooth inside an arch, like the arched doorway of the studio. */
export function LogoMark(props: IconProps) {
  return (
    <svg viewBox="0 0 32 36" aria-hidden="true" {...props}>
      <path d="M2 35V15C2 7.3 8.3 1 16 1s14 6.3 14 14v20z" fill="var(--color-dental-spruce)" />
      <path
        d="M2 35V15C2 7.3 8.3 1 16 1s14 6.3 14 14v20"
        fill="none"
        stroke="var(--color-dental-brass)"
        strokeWidth="1"
        transform="translate(0 0)"
        opacity="0.9"
      />
      <g transform="translate(5.2 8.4) scale(0.9)">
        <path d={TOOTH} fill="var(--color-dental-ivory)" />
      </g>
    </svg>
  );
}
