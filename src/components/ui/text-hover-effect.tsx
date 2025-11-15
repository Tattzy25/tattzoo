"use client";
import React from "react";

export const TextHoverEffect = ({
  text,
}: {
  text: string;
}) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 600 200"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none"
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          <stop offset="0%" stopColor="#eab308" />
          <stop offset="25%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="75%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        className="fill-transparent font-['Rock_Salt'] text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
};
