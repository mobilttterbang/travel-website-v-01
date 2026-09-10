import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { SiteNav } from "@/components/nav/site-nav";
import { SiteFooter } from "@/components/nav/site-footer";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <>
      <SiteNav firstName={session.user.firstName} />
      <div className="relative mx-auto max-w-[1200px] px-5 sm:px-10 lg:px-15">
        {children}
        <SiteFooter />
      </div>
    </>
  );
}
