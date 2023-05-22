import NextImage from "next/image";
import React from "react";
import styles from "./BannerImage.module.css";
import { imageLoader } from "../../utils/client/contentful";
import Overlay from "../Overlay";
import type { Image } from "../../utils/types";

type Props = {
  image: Image;
  title: string;
};

const BannerImage = ({ title, image }: Props) => {
  return (
    <div className={styles.container}>
      <NextImage
        alt={image.description}
        blurDataURL={image.blurDataUrl}
        className={styles.image}
        fill
        loader={imageLoader}
        placeholder="blur"
        priority
        sizes="100vw"
        src={image.url}
      />
      <Overlay type="bannerTitle" direction="left">
        <h1 className={styles.text}>{title}</h1>
      </Overlay>
    </div>
  );
};

export default BannerImage;
