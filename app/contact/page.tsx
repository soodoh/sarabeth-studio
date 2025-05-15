import BannerImage from "@/components/BannerImage";
import ContactForm from "@/components/ContactForm";
import getContactData from "@/utils/server/fetchers/contact";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Sarabeth",
  description:
    "Send an email to Sarabeth for any questions or to follow up with upcoming singing gigs. Feel free to reach out if interested in private voice or piano lessons.",
  icons: "/favicon.png",
};

export default async function ContactPage() {
  const { bannerImage } = await getContactData();

  return (
    <>
      <BannerImage image={bannerImage} title="Contact Sarabeth" />
      <ContactForm />
    </>
  );
}
