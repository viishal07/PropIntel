import React from 'react';

const PropIntelLogo = ({ size = 48 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block' }}
  >
    <rect x="8" y="28" width="48" height="24" rx="6" fill="#1e3a8a" />
    <rect x="20" y="16" width="24" height="16" rx="4" fill="#60a5fa" />
    <path d="M32 8L44 20H20L32 8Z" fill="#1e3a8a" />
    <circle cx="32" cy="40" r="6" fill="#fff" />
    <rect x="29" y="37" width="6" height="6" rx="1.5" fill="#60a5fa" />
  </svg>
);

export default PropIntelLogo; 