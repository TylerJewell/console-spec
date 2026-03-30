import { useRef, useState, useCallback, useEffect, type ReactNode } from "react";

interface TableProps {
  children: ReactNode;
}

export function Table({ children }: TableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  const updateShadows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftShadow(el.scrollLeft > 0);
    setShowRightShadow(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateShadows();
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateShadows);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateShadows]);

  return (
    <div className="relative">
      {showLeftShadow && (
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-background to-transparent" />
      )}
      {showRightShadow && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-background to-transparent" />
      )}
      <div
        ref={scrollRef}
        className="overflow-x-auto"
        onScroll={updateShadows}
      >
        <table className="min-w-full border-separate border-spacing-0.5 table-auto">
          {children}
        </table>
      </div>
    </div>
  );
}
