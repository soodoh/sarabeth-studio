import NextImage from "next/image";
import React from "react";
import { Image } from "../../utils/contentful";
import Overlay from "../Overlay";
import styles from "./BannerImage.module.scss";

type Props = {
  image: Image;
  title: string;
};

const BannerImage = ({ title, image }: Props) => {
  return (
    <div className={styles.container}>
      <NextImage
        alt={image.description}
        src={image.url}
        layout="fill"
        width={image.width}
        height={image.height}
      />
      <Overlay type="left">{title}</Overlay>
    </div>
  );
};

export default BannerImage;
