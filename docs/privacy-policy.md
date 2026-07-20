# Privacy policy — YouTube API Services

Owner-approved for publication on July 19, 2026. This repository document records the approved YouTube disclosure and implementation checklist; it is not legal advice.

## Published disclosure

The Media page uses YouTube API Services to display public information from Sarabeth Belón's configured YouTube playlist, including playlist and video titles, thumbnails, durations, availability, embedding status, and Made-for-Kids status. The site does not use YouTube OAuth, request access to a visitor's YouTube account, or store YouTube account data.

When the Media page loads, the visitor's browser may request video thumbnail images from YouTube. A video player from YouTube's privacy-enhanced `youtube-nocookie.com` domain is created only after the visitor chooses to play an embeddable video. Videos that cannot be embedded link directly to YouTube instead. Google and YouTube may receive technical information associated with these requests, such as the visitor's IP address, browser/device information, referring page, and interactions with their services, and may use cookies or similar technologies under their own policies.

Use of YouTube features is subject to the [YouTube Terms of Service](https://www.youtube.com/t/terms). Google's handling of information is described in the [Google Privacy Policy](https://policies.google.com/privacy).

The current integration does not add autoplay before user action or site-specific analytics to the YouTube player. If the site later adds analytics, advertising, consent controls, OAuth, user-data storage, or different embed behavior, this disclosure and the implementation must be reviewed before release.

Questions about this site's privacy practices may be submitted through the site's Contact page. Requests concerning information handled directly by Google or YouTube should also be directed through the controls and contact methods described in their policies.

## Publication record

- [x] Owner reviewed and approved the wording on July 19, 2026.
- [x] Effective date and site contact path are included.
- [x] The approved policy is implemented at `/privacy` with a persistent footer link.
- [x] The policy links to the YouTube Terms of Service and Google Privacy Policy.
- [x] Media UI retains visible YouTube attribution and direct YouTube links.
- [x] Thumbnail and click-to-load iframe behavior matches the disclosure.
- [ ] Legal counsel review remains optional at the owner's discretion.
