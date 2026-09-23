import type { ReactNode } from "react";

import "./card.css";

/** Полупрозрачная карточка с размытием фона */
export function Card({ children }: { children: ReactNode }) {
  return <div className="card">{children}</div>;
}
