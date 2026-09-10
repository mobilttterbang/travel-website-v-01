import Image from "next/image";

export function Photo({
  shape = "rect",
  className = "",
  alt,
}: {
  shape?: "rect" | "circle";
  className?: string;
  alt: string;
}) {
  return (
    <div
      className={`relative overflow-hidden ${shape === "circle" ? "rounded-full" : ""} ${className}`}
      style={{ filter: "grayscale(1) contrast(1.06)" }}
    >
      <Image src="/photo.jpg" alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
    </div>
  );
}
