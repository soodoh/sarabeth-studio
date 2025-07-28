import "@/styles/globals.css";
import "@/styles/swiper.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import getCommonData from "@/utils/fetchers/common";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sarabeth Belón: Portfolio",
  description:
    "Sarabeth Belon, a young female opera singer, captivates audiences with her tessitura and repertoire versatility. Learn more about this artist!",
  keywords: ["young female opera singer", "opera singer los angeles"],
  icons: "/favicon.png",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { brandName, location, socialMediaLinks } = await getCommonData();

  return (
    <html lang="en">
      <head>
        <meta name="geo.region" content="US-CA" />
        <meta name="geo.placename" content="Altadena" />
        <meta
          name="google-site-verification"
          content="recDsrmbMWYOcfMC0vEE0asXttST_2d-4VZs1EVtSps"
        />

        <meta name="GOOGLEBOT" content="index, follow" />
        <meta name="ROBOTS" content={"index, follow"} />
        <meta name="robots" content={"index, follow"} />

        {/* Favicon */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/favicon/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>

      <body>
        <Header brandName={brandName} />
        <main>{children}</main>
        <Footer location={location} socialMediaLinks={socialMediaLinks} />
      </body>
    </html>
  );
}
