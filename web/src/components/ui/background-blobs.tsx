export function BackgroundBlobs() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className="absolute rounded-full"
        style={{
          top: "-200px",
          right: "-140px",
          width: "640px",
          height: "640px",
          background:
            "radial-gradient(circle at 50% 50%, rgba(236,48,19,0.20), rgba(236,48,19,0) 68%)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          top: "1000px",
          left: "-240px",
          width: "580px",
          height: "580px",
          background:
            "radial-gradient(circle at 50% 50%, rgba(32,30,29,0.14), rgba(32,30,29,0) 70%)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          bottom: "200px",
          right: "-180px",
          width: "540px",
          height: "540px",
          background:
            "radial-gradient(circle at 50% 50%, rgba(236,48,19,0.13), rgba(236,48,19,0) 70%)",
        }}
      />
    </div>
  );
}
