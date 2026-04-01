import type { JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = { children: ReactNode; className?: string };

const WidthContainer = ({ children, className }: Props): JSX.Element => {
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
