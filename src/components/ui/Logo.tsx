import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className = "", width = 41, height = 52 }: LogoProps) {
  return (
    <Image
      src="/icons/logo.svg"
      alt="نهان کافه گالری"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
