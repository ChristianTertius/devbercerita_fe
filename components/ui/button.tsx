"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full border font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
  {
    variants: {
      intent: {
        solid: "border-transparent bg-ink text-white hover:bg-black/80 focus-visible:outline-ink",
        ghost: "border-sand bg-transparent text-ink hover:border-ink",
        subtle: "border-transparent bg-sand/30 text-ink hover:bg-sand/50",
      },
      size: {
        sm: "px-4 py-1 text-sm",
        md: "px-6 py-2 text-base",
      },
    },
    defaultVariants: {
      intent: "solid",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ intent, size, className, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ intent, size }), className)} {...props} />
  );
}
