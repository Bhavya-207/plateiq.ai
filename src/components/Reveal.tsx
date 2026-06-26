import type { ReactNode, ElementType } from "react";
import { useReveal } from "@/hooks/use-reveal";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  id?: string;
}

export function Reveal({ children, as, delay = 0, className = "", id }: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const { ref, visible } = useReveal<HTMLElement>();
  return (
    <Tag
      ref={ref}
      id={id}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
