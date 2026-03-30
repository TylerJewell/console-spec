import type { ReactNode } from "react";
import { ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";

interface ModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  heading: string;
  children: ReactNode;
  ActionButton?: ReactNode;
  showCloseButton?: boolean;
  closeLabel?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
}

export function Modal({
  isOpen,
  onOpenChange,
  heading,
  children,
  ActionButton,
  showCloseButton = true,
  closeLabel = "Close",
  size = "lg",
}: ModalProps) {
  return (
    <HeroModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size={size}
      backdrop="opaque"
      classNames={{
        backdrop: "dark:bg-overlay/80",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="font-[550] dark:font-[500]">
              {heading}
            </ModalHeader>
            <ModalBody className="items-start pb-0">{children}</ModalBody>
            <ModalFooter className="justify-start pt-0 mt-8 pb-8">
              {ActionButton}
              {showCloseButton && (
                <Button variant="light" onPress={onClose}>
                  {closeLabel}
                </Button>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </HeroModal>
  );
}
