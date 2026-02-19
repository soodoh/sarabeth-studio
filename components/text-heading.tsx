import OffsetShadow from "@/components/offset-shadow";
import React from "react";

type Props = {
  text: string;
};

const TextHeading = ({ text }: Props): JSX.Element => {
  return (
    <OffsetShadow type="heading" direction="left">
      <h1 className="m-0 text-[2rem]">{text}</h1>
    </OffsetShadow>
  );
};

export default TextHeading;
