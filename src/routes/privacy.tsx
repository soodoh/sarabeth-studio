import { createFileRoute, Link } from "@tanstack/react-router";
import type { JSX } from "react";
import WidthContainer from "@/components/width-container";

export const Route = createFileRoute("/privacy")({
	head: () => ({
		meta: [
			{ title: "Privacy Policy | Sarabeth Belón" },
			{
				name: "description",
				content:
					"Privacy information for Sarabeth Belón's website, including its use of YouTube API Services.",
			},
		],
	}),
	component: PrivacyPage,
});

function PrivacyPage(): JSX.Element {
	return (
		<WidthContainer className="mb-16 max-w-[800px] font-sans leading-7 [&_a]:underline [&_a]:underline-offset-4 [&_h1]:font-serif [&_h1]:text-4xl [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_p]:my-5">
			<h1>Privacy Policy</h1>
			<p className="text-sm">Effective July 19, 2026</p>

			<h2>YouTube API Services</h2>
			<p>
				The Media page uses YouTube API Services to display public information
				from Sarabeth Belón&apos;s configured YouTube playlist, including
				playlist and video titles, thumbnails, durations, availability,
				embedding status, and Made-for-Kids status. The site does not use
				YouTube OAuth, request access to a visitor&apos;s YouTube account, or
				store YouTube account data.
			</p>
			<p>
				When the Media page loads, the visitor&apos;s browser may request video
				thumbnail images from YouTube. A video player from YouTube&apos;s
				privacy-enhanced <code>youtube-nocookie.com</code> domain is created
				only after the visitor chooses to play an embeddable video. Videos that
				cannot be embedded link directly to YouTube instead. Google and YouTube
				may receive technical information associated with these requests, such
				as the visitor&apos;s IP address, browser or device information,
				referring page, and interactions with their services, and may use
				cookies or similar technologies under their own policies.
			</p>
			<p>
				Use of YouTube features is subject to the{" "}
				<a href="https://www.youtube.com/t/terms">YouTube Terms of Service</a>.
				Google&apos;s handling of information is described in the{" "}
				<a href="https://policies.google.com/privacy">Google Privacy Policy</a>.
			</p>
			<p>
				The current integration does not add autoplay before user action or
				site-specific analytics to the YouTube player. If the site later adds
				analytics, advertising, consent controls, OAuth, user-data storage, or
				different embed behavior, this disclosure and the implementation will be
				reviewed before release.
			</p>

			<h2>Questions</h2>
			<p>
				Questions about this site&apos;s privacy practices may be submitted
				through the <Link to="/contact">Contact page</Link>. Requests concerning
				information handled directly by Google or YouTube should also be
				directed through the controls and contact methods described in their
				policies.
			</p>
		</WidthContainer>
	);
}
