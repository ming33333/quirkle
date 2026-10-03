const INK = "#2f373b";
const PAPER = "#fffcf5";
const PAPER_DEEP = "#e9e0d1";
const INDIGO = "#263d4a";
const VERMILION = "#c64b38";
const VERMILION_DEEP = "#9e3c2d";
const WATER = "#c5d4d8";

const KEY_ROWS = [
  { count: 14, y: 262, indent: 0 },
  { count: 14, y: 286, indent: 10 },
  { count: 13, y: 310, indent: 22 },
];

export default function DeskIllustration() {
  return (
    <svg
      className="hero__desk"
      viewBox="0 -108 960 648"
      role="img"
      aria-label="Top view of a desk with a monitor, keyboard, notebook, and a cup of coffee"
    >
      <rect
        x="2"
        y="2"
        width="956"
        height="536"
        rx="10"
        fill="#e4d6c2"
        stroke={INK}
        strokeWidth="2.5"
      />
      {Array.from({ length: 14 }, (_, index) => (
        <line
          key={index}
          x1="18"
          x2="942"
          y1={36 + index * 36}
          y2={36 + index * 36}
          stroke="#d5c6ae"
          strokeWidth="1"
        />
      ))}

      <rect
        x="150"
        y="-96"
        width="660"
        height="248"
        rx="10"
        fill={PAPER}
        stroke={INK}
        strokeWidth="2.5"
      />
      <rect x="168" y="-78" width="624" height="210" rx="4" fill={INDIGO} />
      <rect
        x="448"
        y="152"
        width="64"
        height="16"
        fill={PAPER_DEEP}
        stroke={INK}
        strokeWidth="2"
      />
      <rect
        x="348"
        y="164"
        width="264"
        height="16"
        rx="4"
        fill={PAPER}
        stroke={INK}
        strokeWidth="2"
      />

      <rect
        x="40"
        y="228"
        width="156"
        height="252"
        fill={PAPER}
        stroke={INK}
        strokeWidth="2.5"
      />
      <rect
        x="82"
        y="248"
        width="68"
        height="118"
        rx="8"
        fill={INDIGO}
        stroke={INK}
        strokeWidth="2"
      />
      <rect x="90" y="260" width="52" height="90" rx="2" fill={WATER} />
      <circle cx="116" cy="356" r="3" fill={PAPER} />
      <rect
        x="62"
        y="424"
        width="108"
        height="22"
        rx="3"
        fill={VERMILION}
        stroke={INK}
        strokeWidth="2"
      />
      <rect
        x="62"
        y="424"
        width="22"
        height="22"
        rx="3"
        fill={VERMILION_DEEP}
        stroke={INK}
        strokeWidth="2"
      />

      <rect
        x="228"
        y="240"
        width="372"
        height="150"
        rx="10"
        fill={PAPER}
        stroke={INK}
        strokeWidth="2.5"
      />
      {KEY_ROWS.flatMap((row) =>
        Array.from({ length: row.count }, (_, index) => (
          <rect
            key={`${row.y}-${index}`}
            x={246 + row.indent + index * 24}
            y={row.y}
            width="20"
            height="18"
            rx="2"
            fill={PAPER_DEEP}
            stroke={INK}
            strokeWidth="1.2"
          />
        )),
      )}
      <rect
        x="318"
        y="334"
        width="168"
        height="18"
        rx="2"
        fill={PAPER_DEEP}
        stroke={INK}
        strokeWidth="1.2"
      />

      <rect
        x="624"
        y="268"
        width="48"
        height="76"
        rx="22"
        fill={PAPER}
        stroke={INK}
        strokeWidth="2.5"
      />
      <line
        x1="648"
        y1="268"
        x2="648"
        y2="292"
        stroke={INK}
        strokeWidth="1.6"
      />

      <rect
        x="708"
        y="220"
        width="132"
        height="168"
        rx="4"
        fill={INDIGO}
        stroke={INK}
        strokeWidth="2.5"
      />
      <line
        x1="722"
        y1="220"
        x2="722"
        y2="388"
        stroke={PAPER}
        strokeWidth="1.5"
        opacity="0.55"
      />
      <rect x="708" y="286" width="132" height="16" fill={VERMILION} />

      <rect
        x="862"
        y="228"
        width="12"
        height="148"
        rx="4"
        fill={INK}
      />
      <rect x="862" y="228" width="12" height="18" rx="3" fill={VERMILION} />

      <ellipse
        cx="790"
        cy="468"
        rx="40"
        ry="40"
        fill={PAPER}
        stroke={INK}
        strokeWidth="2.5"
      />
      <ellipse cx="790" cy="468" rx="26" ry="26" fill={INDIGO} />
      <ellipse
        className="desk-coffee__ripple"
        cx="790"
        cy="468"
        rx="14"
        ry="9"
        fill="none"
        stroke={PAPER}
        strokeWidth="1.4"
      />
      <path
        d="M828 452 a18 16 0 0 1 0 32"
        fill="none"
        stroke={INK}
        strokeWidth="2.5"
      />
      <g className="desk-steam" aria-hidden="true">
        <path
          className="desk-steam__wisp"
          d="M776 430 C770 418 782 410 774 398"
          fill="none"
          stroke={INK}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          className="desk-steam__wisp desk-steam__wisp--mid"
          d="M790 428 C796 414 782 406 790 392"
          fill="none"
          stroke={INK}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          className="desk-steam__wisp desk-steam__wisp--late"
          d="M804 430 C812 418 800 410 808 398"
          fill="none"
          stroke={INK}
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
