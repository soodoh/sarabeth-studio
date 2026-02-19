import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  direction: "left" | "right";
  type: "bannerTitle" | "image" | "heading";
  children: React.ReactNode;
};

const typeStyles = {
  bannerTitle: "w-full h-full",
  image: "w-full h-full",
  heading: "h-[25%] w-full",
};

const positionStyles = {
  bannerTitle: {
    left: "-bottom-[0.8rem] -left-[0.8rem]",
    right: "-bottom-[0.8rem] -right-[0.8rem]",
  },
  image: {
    left: "-bottom-[2rem] -left-[2rem] max-sm:-bottom-[1rem] max-sm:-left-[1rem]",
    right:
      "-bottom-[2rem] -right-[2rem] max-sm:-bottom-[1rem] max-sm:-right-[1rem]",
  },
  heading: {
    left: "bottom-[0.2rem] -left-[0.5rem]",
    right: "bottom-[0.2rem] -right-[0.5rem]",
  },
};

const OffsetShadow = ({ type, direction, children }: Props): JSX.Element => (
  <div className="relative">
    <div
      className={cn(
        "absolute bg-background-light",
        typeStyles[type],
        positionStyles[type][direction],
      )}
    />
    <div className="relative">{children}</div>
  </div>
);

export default OffsetShadow;
