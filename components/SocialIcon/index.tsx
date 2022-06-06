import React from "react";
import EmailSvg from "../../public/email.svg";
import FacebookSvg from "../../public/facebook.svg";
import InstgramSvg from "../../public/instagram.svg";
import LinkedinSvg from "../../public/linkedin.svg";
import TwitterSvg from "../../public/twitter.svg";
import YoutubeSvg from "../../public/youtube.svg";

type Props = {
  source: string;
  className: string;
};

const SocialIcon = ({ source, className }: Props) => {
  if (/facebook/gi.test(source)) {
    return <FacebookSvg className={className} />;
  }
  if (/instagram/gi.test(source)) {
    return <InstgramSvg className={className} />;
  }
  if (/linkedin/gi.test(source)) {
    return <LinkedinSvg className={className} />;
  }
  if (/twitter/gi.test(source)) {
    return <TwitterSvg className={className} />;
  }
  if (/youtube/gi.test(source)) {
    return <YoutubeSvg className={className} />;
  }
  return <EmailSvg className={className} />;
};

export default SocialIcon;
