import type {NextConfig} from "next";

const googleAnalyticsEnabled = process.env.NETLIFY === "true"
  ? process.env.CONTEXT === "production"
  : process.env.SCENESMITH_ENABLE_GA === "true";

const config: NextConfig = {
  env: {NEXT_PUBLIC_SCENESMITH_ENABLE_GA: googleAnalyticsEnabled ? "true" : "false"},
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        {key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains"},
        {key: "X-Content-Type-Options", value: "nosniff"},
        {key: "X-Frame-Options", value: "DENY"},
        {key: "Referrer-Policy", value: "strict-origin-when-cross-origin"},
        {key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()"},
        {key: "Content-Security-Policy", value: `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self' https://checkout.stripe.com; img-src 'self' data: https://i.ytimg.com; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'${googleAnalyticsEnabled ? " https://www.googletagmanager.com" : ""}; connect-src 'self'${googleAnalyticsEnabled ? " https://www.googletagmanager.com https://*.google-analytics.com https://*.google.com" : ""}; frame-src https://js.stripe.com https://hooks.stripe.com https://www.youtube-nocookie.com; font-src 'self' data:;`}
      ]
    }, {
      source: "/:path*",
      has: [{type: "host", value: ".*\\.netlify\\.app"}],
      headers: [{key: "X-Robots-Tag", value: "noindex, nofollow"}]
    }];
  }
};

export default config;
