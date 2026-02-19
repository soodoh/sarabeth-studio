import HomeContent from "@/components/home-content";
import getHomeData from "@/utils/fetchers/home";
import type { Metadata } from "next";

// Statically generated at build time, will error if any Dynamic APIs are used
export const dynamic = "error";

export const metadata: Metadata = {
  title: "Sarabeth Belón: Portfolio",
  description:
    "Sarabeth Belon, a young female opera singer, captivates audiences with her tessitura and repertoire versatility. Learn more about this artist!",
  keywords: ["young female opera singer", "opera singer los angeles"],
  icons: "/favicon.png",
};

const Home = async (): Promise<JSX.Element> => {
  const homeData = await getHomeData();

  return <HomeContent homeData={homeData} />;
};

export default Home;
