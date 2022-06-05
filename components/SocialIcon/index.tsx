import React from "react";
import EmailSvg from "../../public/email.svg";
import FacebookSvg from "../../public/facebook.svg";
import InstgramSvg from "../../public/instagram.svg";
import LinkedinSvg from "../../public/linkedin.svg";
import TwitterSvg from "../../public/twitter.svg";
import YoutubeSvg from "../../public/youtube.svg";

interface Props {
  source: string;
  className: string;
}

export const SocialIcon = (props: Props) => {
  if (/facebook/gi.test(props.source)) {
    return <FacebookSvg className={props.className} />;
  }
  if (/instagram/gi.test(props.source)) {
    return <InstgramSvg className={props.className} />;
  }
  if (/linkedin/gi.test(props.source)) {
    return <LinkedinSvg className={props.className} />;
  }
  if (/twitter/gi.test(props.source)) {
    return <TwitterSvg className={props.className} />;
  }
  if (/youtube/gi.test(props.source)) {
    return <YoutubeSvg className={props.className} />;
  }
  return <EmailSvg className={props.className} />;
};

export default SocialIcon;
