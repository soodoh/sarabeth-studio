import NextImage from "next/image";
import React from "react";
import type { Image as ImageType } from "../../utils/contentful";
import styles from "./StyledImage.module.scss";

interface Props {
  type: "left" | "right";
  image: ImageType;
  priority?: boolean;
}

const StyledImage = (props: Props) => (
  <div className={styles.container}>
    <div className={styles[props.type]} />
    <NextImage
      priority={props.priority}
      alt={props.image.description}
      src={props.image.url}
      layout="responsive"
      width={props.image.width}
      height={props.image.height}
    />
  </div>
);

export default StyledImage;
