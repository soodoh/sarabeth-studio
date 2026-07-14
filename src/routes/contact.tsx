import { createFileRoute } from "@tanstack/react-router";
import type { JSX } from "react";
import BannerImage from "@/components/banner-image";
import ContactForm from "@/components/contact-form";
import { fetchContactData } from "@/utils/server-functions";

export const Route = createFileRoute("/contact")({
	loader: () => fetchContactData(),
	staleTime: Number.POSITIVE_INFINITY,
	head: () => ({
		meta: [
			{ title: "Contact Sarabeth" },
			{
				name: "description",
				content:
					"Send an email to Sarabeth for any questions or to follow up with upcoming singing gigs. Feel free to reach out if interested in private voice or piano lessons.",
			},
		],
	}),
	component: ContactPage,
});

function ContactPage(): JSX.Element {
	const { bannerImage } = Route.useLoaderData();

	return (
		<>
			<BannerImage image={bannerImage} title="Contact Sarabeth" />
			<ContactForm />
		</>
	);
}
