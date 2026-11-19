import {
  CloudSun,
  FlaskConical,
  Leaf,
  Microscope,
  Rabbit,
  Recycle,
  ScanFace,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

/** Icons named in content files (content/home.ts), so copy stays free of imports. */
export const CONTENT_ICONS: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  flask: FlaskConical,
  leaf: Leaf,
  rabbit: Rabbit,
  recycle: Recycle,
  microscope: Microscope,
  "cloud-sun": CloudSun,
  "scan-face": ScanFace,
};

export function ContentIcon({ name, className }: { name: string; className?: string }) {
  const Icon = CONTENT_ICONS[name] ?? Leaf;
  return <Icon className={className} strokeWidth={1.6} aria-hidden />;
}
