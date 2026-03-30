import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeDropdown() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-8 h-8" />;

  const Icon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" size="sm" isIconOnly aria-label="Theme">
          <Icon className="w-5 h-5" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Theme selection"
        selectionMode="single"
        selectedKeys={theme ? [theme] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0];
          if (selected) setTheme(String(selected));
        }}
      >
        <DropdownItem key="light" startContent={<Sun className="w-4 h-4" />}>Light</DropdownItem>
        <DropdownItem key="dark" startContent={<Moon className="w-4 h-4" />}>Dark</DropdownItem>
        <DropdownItem key="system" startContent={<Monitor className="w-4 h-4" />}>System</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
