export function PostcardGraphic() {
  return (
    <svg
      viewBox="0 0 320 220"
      role="img"
      aria-label="Vintage postcard background"
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        borderRadius: '18px',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.18)',
      }}
    >
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f9f3e5" />
          <stop offset="100%" stopColor="#f2e6d6" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="320" height="220" fill="url(#bg)" rx="14" />
      <rect
        x="10"
        y="10"
        width="300"
        height="200"
        fill="none"
        stroke="#d6c7b3"
        strokeWidth="2"
        rx="10"
      />

      {Array.from({ length: 10 }).map((_, index) => (
        <g key={`stripe-top-${index}`}>
          <polygon
            points={`${16 + index * 30},14 ${24 + index * 30},14 ${18 + index * 30},30 ${10 + index * 30},30`}
            fill={index % 2 === 0 ? '#7bb6f0' : '#d8c4aa'}
          />
          <polygon
            points={`${16 + index * 30},206 ${24 + index * 30},206 ${18 + index * 30},190 ${10 + index * 30},190`}
            fill={index % 2 === 0 ? '#7bb6f0' : '#d8c4aa'}
          />
        </g>
      ))}

      <text
        x="24"
        y="38"
        fontSize="20"
        fontFamily="'Playfair Display', 'Georgia', serif"
        fill="#5b4b3b"
      >
        POSTCARD
      </text>

      {Array.from({ length: 4 }).map((_, index) => (
        <line
          key={`address-line-${index}`}
          x1={24}
          x2={152}
          y1={70 + index * 24}
          y2={70 + index * 24}
          stroke="#c9b69d"
          strokeWidth="1"
        />
      ))}

      <line
        x1="160"
        y1="30"
        x2="160"
        y2="190"
        stroke="#d6c7b3"
        strokeDasharray="4 4"
        strokeWidth="1"
      />

      <text
        x="182"
        y="60"
        fontSize="16"
        fontFamily="'Playfair Display', 'Georgia', serif"
        fill="#5b4b3b"
      >
        to:
      </text>
      <line x1="182" x2="300" y1="75" y2="75" stroke="#c9b69d" strokeWidth="1" />

      <text
        x="182"
        y="110"
        fontSize="16"
        fontFamily="'Playfair Display', 'Georgia', serif"
        fill="#5b4b3b"
      >
        from:
      </text>
      <line
        x1="182"
        x2="300"
        y1="125"
        y2="125"
        stroke="#c9b69d"
        strokeWidth="1"
      />

      <circle
        cx="262"
        cy="40"
        r="24"
        fill="none"
        stroke="#d6c7b3"
        strokeWidth="2"
      />
      <circle
        cx="262"
        cy="40"
        r="14"
        fill="#ebd8be"
        stroke="#d6c7b3"
        strokeWidth="1"
      />
      <path
        d="M198 38h36M198 46h36M198 54h36"
        stroke="#d6c7b3"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

