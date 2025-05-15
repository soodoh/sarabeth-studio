import SvgEmail from "@/components/icons/Email";
import SvgFacebook from "@/components/icons/Facebook";
import SvgInstagram from "@/components/icons/Instagram";
import SvgLinkedin from "@/components/icons/Linkedin";
import SvgYoutube from "@/components/icons/Youtube";
import React from "react";
import type { SocialMediaType } from "@/utils/types";

type Props = {
  source: SocialMediaType;
  className: string;
};

const SocialIcon = ({ source, className }: Props) => {
  switch (source.toLowerCase()) {
    case "facebook":
      return <SvgFacebook className={className} />;
    case "instagram":
      return <SvgInstagram className={className} />;
    case "linkedin":
      return <SvgLinkedin className={className} />;
    case "youtube":
      return <SvgYoutube className={className} />;
    case "email":
    default:
      return <SvgEmail className={className} />;
  }
};

export default SocialIcon;
