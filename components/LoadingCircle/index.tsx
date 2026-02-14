import React from "react";

type Props = {
  size?: number;
  strokeWidth?: number;
};

const LoadingCircle = ({ size = 50, strokeWidth = 10 }: Props) => {
  return (
    <svg
      className="-rotate-90 fill-none [stroke-linecap:round]"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        strokeWidth: strokeWidth,
      }}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="animate-loading-spin stroke-accent origin-center"
        style={{ strokeDasharray: 312, strokeDashoffset: 0 }}
        cx="60"
        cy="60"
        r="50"
      />
    </svg>
  );
};

export default LoadingCircle;
