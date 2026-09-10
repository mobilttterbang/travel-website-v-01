import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Eyebrow } from "@/components/ui/glass";
import { Photo } from "@/components/ui/photo";
import { AuthTrigger } from "@/components/modal/auth-trigger";
import { ArrowRightIcon } from "@/components/ui/icons";
import { StorySlider } from "@/components/story/story-slider";
import { getAllStories } from "@/lib/stories";

const FEATURES = [
  {
    n: "01",
    title: "The whole place, not a corridor",
    body: "Every listing is booked whole — no shared lobbies, no wristbands, no neighbours through the wall at 2am.",
  },
  {
    n: "02",
    title: "A kitchen you would actually use",
    body: "Sharp knives, a full spice shelf, coffee for the first two mornings. Breakfast stops being a queue.",
  },
  {
    n: "03",
    title: "Hosts who answer",
    body: "Every host lives within twenty minutes and replies inside two hours. Gate codes arrive before you ask.",
  },
  {
    n: "04",
    title: "Pay the way you pay",
    body: "Card, a virtual account number, or Midtrans — priced the same either way, with no booking fee bolted on.",
  },
];

const STEPS = [
  {
    title: "Filter to your kind of place.",
    body: "Apartment, hotel, villa or home — then city, price, beds and rating.",
  },
  {
    title: "Pick your dates and pay.",
    body: "Card, generated virtual account, or Midtrans. Confirmation lands before you close the tab.",
  },
  {
    title: "Turn up.",
    body: "Directions, gate code and the host's number sit in your booking, editable until seven days out.",
  },
];

export default async function LandingPage() {
  const session = await auth();
  if (session?.user) redirect("/home");

  const stories = await getAllStories();

  return (
    <div className="relative mx-auto max-w-[1200px] px-5 sm:px-10 lg:px-15">
      <header className="flex flex-wrap items-center gap-3.5 pt-6 sm:pt-9">
        <span className="mr-auto flex items-center gap-2.5 text-xl font-extrabold tracking-tight">
          <span className="inline-block h-3.5 w-3.5 rounded-[4px] bg-accent" />
          Staycation
        </span>
        <AuthTrigger mode="login" variant="glass" size="md">
          Log in
        </AuthTrigger>
        <AuthTrigger mode="signup" variant="primary" size="md">
          Sign up
        </AuthTrigger>
      </header>

      <section className="flex flex-wrap items-center gap-7 pt-10 sm:gap-14 sm:pt-22">
        <div className="min-w-0 flex-1 basis-[380px]">
          <Eyebrow>Apartments, hotels, villas and homes</Eyebrow>
          <h1 className="m-0 text-[38px] leading-[1.04] font-extrabold tracking-[-0.035em] sm:text-[68px]">
            Forget Busy Work,
            <br />
            Start Next Vacation
          </h1>
          <p className="m-0 mt-5.5 max-w-[46ch] text-[17.5px] leading-relaxed text-body">
            One list of places worth the drive, kept by people who live there. Book the whole apartment in two
            minutes, pay how you like, and turn up to a made-up bed.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <AuthTrigger mode="signup" variant="primary" size="lg">
              Sign up free
            </AuthTrigger>
            <AuthTrigger mode="login" variant="glass" size="lg">
              I have an account
            </AuthTrigger>
          </div>
          <p className="m-0 mt-4.5 text-sm text-muted">No booking fee · Free cancellation up to 7 days · 80,409 travellers</p>
        </div>
        <div className="relative min-w-0 flex-1 basis-[420px]">
          <div className="glass absolute top-11 right-[-14px] bottom-[-18px] left-11 rounded-sc-lg" style={{ ["--glass-opacity" as string]: 0.5 }} />
          <div className="relative overflow-hidden rounded-sc-lg shadow-[0_24px_60px_rgba(32,30,29,0.18)]">
            <Photo shape="rect" alt="The landing hero photograph" className="aspect-[4/3] w-full" />
          </div>
        </div>
      </section>

      <section className="pt-13 sm:pt-22">
        <h2 className="m-0 mb-2 max-w-[26ch] text-2xl font-extrabold tracking-[-0.03em] sm:text-[38px]">
          Why book an apartment here instead of a hotel room
        </h2>
        <p className="m-0 mb-7 max-w-[52ch] text-[16.5px] leading-relaxed text-body">
          Same money, more room, and a kitchen. We only list places we have stayed in ourselves.
        </p>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.n}
              className="glass rounded-sc-lg border border-white/80 p-6.5 shadow-[0_12px_32px_rgba(32,30,29,0.09)]"
              style={{ ["--glass-opacity" as string]: 0.62 }}
            >
              <p className="m-0 mb-3.5 text-[34px] font-extrabold tracking-[-0.03em] text-accent">{f.n}</p>
              <h3 className="m-0 mb-2 text-[19px] font-extrabold tracking-[-0.02em]">{f.title}</h3>
              <p className="m-0 text-[15.5px] leading-relaxed text-body">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-11 sm:pt-18">
        <div
          className="glass flex flex-wrap items-center gap-6 rounded-sc-lg border border-white/80 p-5 shadow-[0_14px_40px_rgba(32,30,29,0.10)] sm:gap-12 sm:p-8"
          style={{ ["--glass-opacity" as string]: 0.62 }}
        >
          <div className="min-w-0 flex-1 basis-[260px] overflow-hidden rounded-sc shadow-[0_16px_40px_rgba(32,30,29,0.16)]">
            <Photo shape="rect" alt="A guest photograph" className="aspect-[3/4] w-full" />
          </div>
          <div className="min-w-0 flex-1 basis-[320px]">
            <p className="m-0 mb-3 text-[13px] font-bold tracking-[0.1em] text-accent-deep uppercase">How it goes</p>
            <h2 className="m-0 mb-5.5 max-w-[24ch] text-2xl font-extrabold tracking-[-0.03em] sm:text-[32px]">
              Three screens between you and a weekend away
            </h2>
            <div className="flex flex-col gap-4">
              {STEPS.map((s, i) => (
                <p key={s.title} className="m-0 flex items-start gap-3.5 text-base leading-relaxed text-body">
                  <span className="flex h-7.5 w-7.5 flex-none items-center justify-center rounded-[11px] bg-accent text-sm font-extrabold text-white">
                    {i + 1}
                  </span>
                  <span>
                    <strong className="text-ink">{s.title}</strong> {s.body}
                  </span>
                </p>
              ))}
            </div>
            <AuthTrigger mode="signup" variant="primary" size="md" className="mt-7">
              Create an account
            </AuthTrigger>
          </div>
        </div>
      </section>

      <section className="pt-11 sm:pt-18">
        <StorySlider stories={stories} startIndex={1} />
      </section>

      <section className="pt-11 sm:pt-18">
        <div className="relative overflow-hidden rounded-sc-lg bg-accent p-8 shadow-[0_24px_60px_rgba(236,48,19,0.28)] sm:p-16">
          <div
            aria-hidden="true"
            className="absolute -top-35 -right-20 h-[420px] w-[420px] rounded-full"
            style={{ background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.32), rgba(255,255,255,0) 70%)" }}
          />
          <div className="relative flex flex-wrap items-end justify-between gap-7">
            <div>
              <h2 className="m-0 max-w-[22ch] text-[28px] leading-[1.06] font-extrabold tracking-[-0.035em] text-white sm:text-[54px]">
                1,405 places.
                <br />
                One account.
              </h2>
              <p className="m-0 mt-4.5 max-w-[44ch] text-[17px] leading-relaxed text-white">
                Sign up and the whole list opens — filters, saved houses, booking history and every host&apos;s
                number.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <AuthTrigger mode="signup" variant="dark" size="lg" className="!bg-white !text-ink hover:!text-accent-deep">
                Sign up
                <ArrowRightIcon />
              </AuthTrigger>
              <AuthTrigger mode="login" variant="dark" size="lg" className="!bg-white/18 !text-white border border-white/60 hover:!bg-white/30">
                Log in
              </AuthTrigger>
            </div>
          </div>
        </div>
      </section>

      <div className="pt-13 pb-4 text-center text-[13px] text-muted">Demo account: angga@staycation.id / password123</div>
    </div>
  );
}
