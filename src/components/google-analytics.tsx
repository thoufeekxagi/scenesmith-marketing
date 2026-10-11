import Script from "next/script";

const GA_MEASUREMENT_ID = "G-428G30Y20B";

export function GoogleAnalytics() {
  if (
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_SCENESMITH_ENABLE_GA !== "true"
  ) return null;

  return (
    <>
      <Script
        async
        strategy="beforeInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="google-tag" strategy="beforeInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
