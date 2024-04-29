import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TAG}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />
        <!-- Cloudflare Web Analytics -->
          <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon={'{"token": "' + process.env.CLOUDFLARE_ANALYTICS_TOKEN + '"}'}></script>
          <!-- End Cloudflare Web Analytics -->
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
