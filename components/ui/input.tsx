import { cn } from "@/lib/utils";
import * as React from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 appearance-none rounded-md border border-accent bg-background-light px-3 py-1 text-base text-foreground [box-shadow:none] outline-none transition-colors placeholder:text-foreground/50 focus-visible:border-foreground focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:border-red-500",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
