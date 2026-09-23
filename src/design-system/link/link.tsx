import type { AnchorHTMLAttributes } from "react";

import { cn } from "@/lib/cn";
import "./link.css";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

/** Внешняя ссылка: открывается в новой вкладке */
export function Link({ className, ...rest }: LinkProps) {
  return <a className={cn("link", className)} target="_blank" rel="noopener noreferrer" {...rest} />;
}
