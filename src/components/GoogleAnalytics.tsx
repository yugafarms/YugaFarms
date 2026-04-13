"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useAuth } from "@/app/context/AuthContext";
import {
  GA_MEASUREMENT_ID,
  setGaUserId,
  trackGaPageView,
} from "@/lib/gtag";

function RouteChangeTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return;
    const q = searchParams.toString();
    const path = q ? `${pathname}?${q}` : pathname;
    trackGaPageView(path);
  }, [pathname, searchParams]);

  return null;
}

function UserIdSync() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || isLoading) return;
    setGaUserId(user ? String(user.id) : null);
  }, [user, isLoading]);

  return null;
}

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga4-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              send_page_view: false
            });
          `,
        }}
      />
      <UserIdSync />
      <Suspense fallback={null}>
        <RouteChangeTracker />
      </Suspense>
    </>
  );
}
