import { cn } from "@/lib/utils";
import * as React from "react";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full appearance-none rounded-md border border-accent bg-background-light px-3 py-2 text-base text-foreground [box-shadow:none] outline-none transition-colors placeholder:text-foreground/50 focus-visible:border-foreground focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "aria-invalid:border-red-500",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
