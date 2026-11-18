import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { Offer } from "@/components/home/Offer";
import { Why } from "@/components/home/Why";
import { Technology } from "@/components/home/Technology";
import { Catalog } from "@/components/home/Catalog";
import { Payment } from "@/components/home/Payment";
import { Steps } from "@/components/home/Steps";
import { Realized } from "@/components/home/Realized";
import { Reviews } from "@/components/home/Reviews";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main>
      <Hero />
      {/* Светлая часть «наезжает» на графитовый hero скруглённым краем */}
      <div className="bg-graphite">
        <div className="flex flex-col gap-[var(--gutter)] rounded-t-[var(--radius-section)] bg-bg pt-[var(--gutter)] pb-[var(--gutter)]">
          <Offer />
          <Why />
          <Technology />
          <Catalog />
          <Payment />
          <Steps />
          <Realized />
          <Reviews />
          <Faq />
          <FinalCta />
        </div>
      </div>
    </main>
  );
}
