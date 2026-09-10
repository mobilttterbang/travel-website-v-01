export function SiteFooter() {
  return (
    <footer className="mt-13 border-t border-[rgba(32,30,29,0.14)] pt-7.5">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-7">
        <div>
          <p className="m-0 mb-3 flex items-center gap-2.5 text-lg font-extrabold tracking-tight">
            <span className="inline-block h-2.5 w-2.5 rounded-[4px] bg-accent" />
            Staycation
          </p>
          <p className="m-0 max-w-[26ch] text-[14.5px] leading-relaxed text-muted">
            We kaboom your beauty holiday instantly and memorable.
          </p>
        </div>
        <div>
          <p className="m-0 mb-3 text-[13px] font-extrabold tracking-[0.08em] uppercase">For beginners</p>
          <div className="flex flex-col gap-2 text-[14.5px] text-muted">
            <span>New account</span>
            <span>Start booking a room</span>
            <span>Use payments</span>
          </div>
        </div>
        <div>
          <p className="m-0 mb-3 text-[13px] font-extrabold tracking-[0.08em] uppercase">Explore us</p>
          <div className="flex flex-col gap-2 text-[14.5px] text-muted">
            <span>Our careers</span>
            <span>Privacy</span>
            <span>Terms &amp; conditions</span>
          </div>
        </div>
        <div>
          <p className="m-0 mb-3 text-[13px] font-extrabold tracking-[0.08em] uppercase">Connect us</p>
          <div className="flex flex-col gap-2 text-[14.5px] text-muted">
            <span>support@staycation.id</span>
            <span>021 – 2208 – 1996</span>
            <span>Staycation, Kemang, Jakarta</span>
          </div>
        </div>
      </div>
      <p className="m-0 mt-8 pb-9 text-center text-[13.5px] text-muted">Copyright 2026 · All rights reserved · Staycation</p>
    </footer>
  );
}
