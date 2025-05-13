import React from "react";
import EmailSvg from "../../public/email.svg";
import FacebookSvg from "../../public/facebook.svg";
import InstgramSvg from "../../public/instagram.svg";
import LinkedinSvg from "../../public/linkedin.svg";
import TwitterSvg from "../../public/twitter.svg";
import YoutubeSvg from "../../public/youtube.svg";
import type { SocialMediaType } from "../../utils/types";

type Props = {
  source: SocialMediaType;
  className: string;
};

const SocialIcon = ({ source, className }: Props) => {
  switch (source) {
    case 'facebook':
      return <FacebookSvg className={className} />;
    case 'instagram':
      return <InstgramSvg className={className} />;
    case 'linkedin':
      return <LinkedinSvg className={className} />;
    case 'twitter':
      return <TwitterSvg className={className} />;
    case 'youtube':
      return <YoutubeSvg className={className} />;
    case 'email':
    default:
      return <EmailSvg className={className} />;
  }
};

export default SocialIcon;
