import type { ReactNode } from "react";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div
      className="grid h-screen w-full overflow-hidden pt-[49px] md:pt-0"
      style={{
        gridTemplateColumns: "auto minmax(0, 1fr)",
        gridTemplateRows: "minmax(0, 1fr)",
        gridTemplateAreas: "'primary-nav main'",
      }}
    >
      {children}
    </div>
  );
}
