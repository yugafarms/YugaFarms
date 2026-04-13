"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useAuth } from "@/app/context/AuthContext";
import {
  buildMetaAdvancedMatchingParams,
  readCheckoutContact,
  readSignupDraft,
  YGF_PIXEL_CONTACT_EVENT,
} from "@/lib/metaAdvancedMatching";

const PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "1652373069234970";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function waitForFbq(onReady: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  if (window.fbq) {
    onReady();
    return () => {};
  }
  const t = window.setInterval(() => {
    if (window.fbq) {
      window.clearInterval(t);
      onReady();
    }
  }, 50);
  const max = window.setTimeout(() => window.clearInterval(t), 10000);
  return () => {
    window.clearInterval(t);
    window.clearTimeout(max);
  };
}

/** Runs fbq init with merged auth + checkout + signup draft; first hit also sends PageView. */
function FbqAdvancedMatchingInit() {
  const { user, isLoading } = useAuth();
  const [contactEpoch, setContactEpoch] = useState(0);
  const lastInitKey = useRef<string | null>(null);

  useEffect(() => {
    const bump = () => setContactEpoch((n) => n + 1);
    window.addEventListener(YGF_PIXEL_CONTACT_EVENT, bump);
    return () => window.removeEventListener(YGF_PIXEL_CONTACT_EVENT, bump);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const cancelWait = waitForFbq(() => {
      const checkout = readCheckoutContact();
      const signupDraft = readSignupDraft();
      const params = buildMetaAdvancedMatchingParams(user, checkout, signupDraft);
      const key = JSON.stringify(params);
      if (key === lastInitKey.current) return;
      lastInitKey.current = key;

      window.fbq?.("init", PIXEL_ID, params);
    });

    return cancelWait;
  }, [user, isLoading, contactEpoch]);

  return null;
}

function PixelTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined" || !window.fbq) return;
    window.fbq("track", "PageView");
  }, [pathname, searchParams]);

  return null;
}

export default function MetaPixel() {
  return (
    <>
      <Script
        id="fb-pixel-bootstrap"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
      <FbqAdvancedMatchingInit />
      <Suspense fallback={null}>
        <PixelTracker />
      </Suspense>
    </>
  );
}
