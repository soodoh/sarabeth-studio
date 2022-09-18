import React from "react";
import styles from "./LoadingCircle.module.scss";

type Props = {
  size?: number;
  strokeWidth?: number;
};

const LoadingCircle = ({ size = 50, strokeWidth = 10 }: Props) => {
  return (
    <svg
      className={styles.loader}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        strokeWidth: strokeWidth,
      }}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle className={styles.circle} cx="60" cy="60" r="50" />
    </svg>
  );
};

export default LoadingCircle;
