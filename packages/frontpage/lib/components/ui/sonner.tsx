"use client";

import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { Spinner } from "./spinner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CheckCircledIcon className="size-4" />,
        info: <InfoCircledIcon className="size-4" />,
        warning: <ExclamationTriangleIcon className="size-4" />,
        error: <CrossCircledIcon className="size-4" />,
        loading: <Spinner />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
