import HomeContent from "@/components/HomeContent";
import getHomeData from "@/utils/server/fetchers/home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sarabeth Belón: Portfolio",
  description:
    "Sarabeth Belon, a young female opera singer, captivates audiences with her tessitura and repertoire versatility. Learn more about this artist!",
  keywords: ["young female opera singer", "opera singer los angeles"],
  icons: "/favicon.png",
};

const Home = async () => {
  const homeData = await getHomeData();

  return <HomeContent homeData={homeData} />;
};

export default Home;
