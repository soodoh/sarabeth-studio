/* oxlint-disable typescript-eslint/explicit-module-boundary-types */
import OffsetShadow from "@/components/OffsetShadow";
import React from "react";

type Props = {
  text: string;
};

const TextHeading = ({ text }: Props) => {
  return (
    <OffsetShadow type="heading" direction="left">
      <h1 className="m-0 text-[2rem]">{text}</h1>
    </OffsetShadow>
  );
};

export default TextHeading;
