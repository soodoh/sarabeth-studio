/* oxlint-disable typescript-eslint/explicit-module-boundary-types */
import { cn } from "@/lib/utils";
import React from "react";

type Props = { children: React.ReactNode; className?: string };

const WidthContainer = ({ children, className }: Props) => {
  return (
    <div
      className={cn(
        "mx-auto mt-6 w-full max-w-[1200px] px-[2.5rem]",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default WidthContainer;
