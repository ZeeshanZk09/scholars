"use client";

import { Loader2 } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";

type SubmitButtonProps = ButtonProps & {
  loading?: boolean;
  loadingLabel?: string;
};

export function SubmitButton({
  loading,
  loadingLabel = "Please wait…",
  children,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}