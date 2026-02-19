/* oxlint-disable typescript-eslint/explicit-module-boundary-types */
import OffsetShadow from "@/components/OffsetShadow";
import NextImage from "next/image";
import React from "react";
import type { ImageType } from "@/utils/types";

type Props = {
  image: ImageType;
  title: string;
};

const BannerImage = ({ title, image }: Props) => {
  return (
    <div className="relative flex h-[500px] w-full items-center justify-center bg-foreground bg-cover bg-center">
      <NextImage
        alt={image.description}
        blurDataURL={image.placeholder}
        className="z-0 object-cover"
        fill
        placeholder="blur"
        priority
        sizes="100vw"
        src={image.url}
      />
      <OffsetShadow type="bannerTitle" direction="left">
        <h1 className="m-0 bg-accent px-20 py-6 font-sans text-[1.7rem] font-thin uppercase tracking-wide text-background-light max-sm:text-base">
          {title}
        </h1>
      </OffsetShadow>
    </div>
  );
};

export default BannerImage;
