import { cn } from "@/lib/cn";

/**
 * A stylised, not-to-scale map of the studio's neighbourhood. Drawn in SVG so the demo needs no
 * map service; the real website would add a "Get directions" link (which it has) or an embed.
 */
export default function MapIllustration({ className }: { className?: string }) {
  return (
    <figure
      className={cn(
        "relative aspect-[16/11] overflow-hidden rounded-[1.5rem] bg-[#ece4d6]",
        className,
      )}
    >
      <svg
        viewBox="0 0 640 440"
        role="img"
        aria-labelledby="dental-map-title dental-map-desc"
        className="block h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <title id="dental-map-title">Map illustration of the studio on Rajpur Road</title>
        <desc id="dental-map-desc">
          Rajpur Road runs from the Clock Tower in the south up towards Rajpur and Mussoorie. The
          studio is just past Dilaram Chowk, on the left as you head north, with parking behind the
          building.
        </desc>

        {/* City blocks */}
        <g fill="#e2d8c6">
          <rect x="24" y="24" width="120" height="86" rx="10" />
          <rect x="160" y="24" width="96" height="60" rx="10" />
          <rect x="24" y="128" width="88" height="96" rx="10" />
          <rect x="448" y="24" width="168" height="70" rx="10" />
          <rect x="500" y="250" width="116" height="80" rx="10" />
          <rect x="390" y="348" width="120" height="70" rx="10" />
          <rect x="24" y="300" width="110" height="116" rx="10" />
          <rect x="150" y="364" width="90" height="52" rx="10" />
          <rect x="520" y="112" width="96" height="120" rx="10" />
          <rect x="300" y="24" width="120" height="50" rx="10" />
        </g>

        {/* Park */}
        <rect x="132" y="196" width="120" height="78" rx="18" fill="#cfdccd" />
        <g fill="#b6cbb5">
          <circle cx="158" cy="222" r="9" />
          <circle cx="190" cy="244" r="12" />
          <circle cx="226" cy="220" r="8" />
          <circle cx="222" cy="254" r="7" />
        </g>

        {/* Side roads */}
        <g stroke="#fbf8f2" strokeWidth="10" strokeLinecap="round" fill="none">
          <path d="M120 120 L330 196" />
          <path d="M400 166 L630 120" />
          <path d="M372 196 L470 440" />
          <path d="M0 270 L150 256" />
          <path d="M440 238 L640 230" />
        </g>

        {/* Rajpur Road */}
        <path
          d="M60 440 C150 380 240 330 300 270 S 390 170 440 120 S 540 40 600 0"
          stroke="#c9bba3"
          strokeWidth="26"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M60 440 C150 380 240 330 300 270 S 390 170 440 120 S 540 40 600 0"
          stroke="#fffdf9"
          strokeWidth="20"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M60 440 C150 380 240 330 300 270 S 390 170 440 120 S 540 40 600 0"
          stroke="#d9cdb8"
          strokeWidth="1.5"
          strokeDasharray="8 10"
          fill="none"
        />
        <text fontSize="13" fill="#7a6a50" fontWeight="600" letterSpacing="0.08em">
          <textPath href="#dental-road-label" startOffset="8%">
            RAJPUR ROAD
          </textPath>
        </text>
        <path id="dental-road-label" d="M70 412 C150 360 230 318 288 262" fill="none" />

        {/* Dilaram Chowk roundabout */}
        <circle cx="372" cy="190" r="24" fill="#fffdf9" stroke="#c9bba3" strokeWidth="3" />
        <circle cx="372" cy="190" r="11" fill="#cfdccd" />
        <text x="372" y="238" textAnchor="middle" fontSize="12.5" fill="#5b4c35" fontWeight="700">
          Dilaram Chowk
        </text>

        {/* Clock Tower */}
        <g transform="translate(78 404)">
          <circle r="14" fill="#fffdf9" stroke="#c09a5f" strokeWidth="2.5" />
          <path
            d="M0 -6 V0 L5 3"
            stroke="#7f5f2c"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>
        <text x="100" y="430" fontSize="12.5" fill="#5b4c35" fontWeight="700">
          Clock Tower, 2.5 km
        </text>

        {/* Towards Mussoorie */}
        <g transform="translate(560 54)">
          <text x="-6" y="0" textAnchor="end" fontSize="12" fill="#5b4c35" fontWeight="600">
            To Rajpur and Mussoorie
          </text>
          <path
            d="M2 -4 L18 -18 M18 -18 L8 -18 M18 -18 L18 -8"
            stroke="#5b4c35"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Parking behind the studio */}
        <g transform="translate(360 88)">
          <rect x="-15" y="-15" width="30" height="30" rx="7" fill="#1d4b45" />
          <text x="0" y="6" textAnchor="middle" fontSize="17" fontWeight="700" fill="#fffdf9">
            P
          </text>
        </g>
        <path
          d="M376 92 C 388 96 394 104 397 112"
          stroke="#1d4b45"
          strokeWidth="2"
          strokeDasharray="3 4"
          fill="none"
        />

        {/* The studio */}
        <g transform="translate(400 136)">
          <ellipse cx="0" cy="4" rx="14" ry="5" fill="rgb(16 45 42 / 0.18)" />
          <path
            d="M0 0 C -6 -10 -18 -20 -18 -33 A18 18 0 1 1 18 -33 C 18 -20 6 -10 0 0 Z"
            fill="#1d4b45"
            stroke="#fffdf9"
            strokeWidth="2.5"
          />
          <circle cx="0" cy="-33" r="7" fill="#c09a5f" />
        </g>
        <g transform="translate(452 160)">
          <rect x="0" y="-44" width="168" height="48" rx="12" fill="#fffdf9" stroke="#e2d9ca" />
          <text x="14" y="-24" fontSize="13.5" fontWeight="700" fill="#102d2a">
            Ivorine Dental Studio
          </text>
          <text x="14" y="-8" fontSize="11.5" fill="#566461">
            Kesar Court, 2nd floor
          </text>
        </g>

        {/* Compass */}
        <g transform="translate(600 400)">
          <circle r="18" fill="#fffdf9" stroke="#e2d9ca" />
          <path d="M0 -11 L5 4 L0 1 L-5 4 Z" fill="#102d2a" />
          <text y="-24" textAnchor="middle" fontSize="11" fontWeight="700" fill="#102d2a">
            N
          </text>
        </g>
      </svg>
      <figcaption className="absolute top-3 left-3 rounded-full bg-dental-paper/90 px-3 py-1 text-[0.75rem] font-medium text-dental-muted backdrop-blur">
        Illustration, not to scale
      </figcaption>
    </figure>
  );
}
