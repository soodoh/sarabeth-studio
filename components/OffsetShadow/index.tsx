import classNames from "classnames/bind";
import React from "react";
import styles from "./OffsetShadow.module.css";

const cx = classNames.bind(styles);

type Props = {
  direction: "left" | "right";
  type: "bannerTitle" | "image" | "heading";
  children: React.ReactNode;
};

const OffsetShadow = ({ type, direction, children }: Props) => (
  <div className={styles.container}>
    <div className={cx(styles.shadow, type, direction)} />
    <div className={styles.content}>{children}</div>
  </div>
);

export default OffsetShadow;
