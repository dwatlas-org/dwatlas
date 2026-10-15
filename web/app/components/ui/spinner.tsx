import { cva, type VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin text-muted-foreground shrink-0", {
  variants: {
    size: {
      default: "size-4",
      sm: "size-3",
      lg: "size-6",
      xl: "size-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface SpinnerProps
  extends
    Omit<React.ComponentProps<typeof Loader2Icon>, "size">,
    VariantProps<typeof spinnerVariants> {
  className?: string;
}

function Spinner({ className, size, ...props }: SpinnerProps) {
  return (
    <Loader2Icon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  );
}

export { Spinner, spinnerVariants };
