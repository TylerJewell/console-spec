import { ReactNode, useState, useEffect, useRef } from "react";
import { Button } from "@heroui/button";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { GridMindLogo } from "./Icons/GridMindLogo";
import { ThemeDropdown } from "./ThemeDropdown";

export function Header({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setIsOpen(false), []); // close on route change handled elsewhere

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        requestAnimationFrame(() => toggleRef.current?.focus());
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      <header className="flex flex-col h-full md:border-r border-divider md:overflow-auto md:z-20">
        {/* Top bar */}
        <div className="fixed top-0 left-0 right-0 z-50 md:static md:z-auto flex items-center justify-between bg-background border-b border-divider md:border-b-0 px-2 py-1.5">
          <Link to="/" className="flex items-center gap-2 h-8">
            <GridMindLogo className="h-5 w-auto" />
            <span className="font-[550] dark:font-[500] text-sm">GridMind</span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeDropdown />
            <Button
              ref={toggleRef}
              className="md:hidden"
              isIconOnly
              variant="bordered"
              size="sm"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              onPress={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Drawer content */}
        <div
          className={`
            flex flex-col overflow-auto bg-background
            fixed top-[49px] bottom-0 right-0 w-80 z-50
            border-l border-divider
            transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "translate-x-full"}
            md:static md:inset-auto md:flex-1
            md:w-auto md:translate-x-0 md:border-l-0 md:z-auto
          `}
        >
          <div className="flex-1 overflow-y-auto md:border-t border-divider">
            {children}
          </div>
        </div>
      </header>

      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
    </>
  );
}
