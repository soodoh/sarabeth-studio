import Link from "next/link";
import type { LinkProps } from "next/link";
import type { ReactNode } from "react";

type Props = LinkProps & {
  href: string;
  children: ReactNode;
};

const WrappedLink = ({ children, href, ...linkProps }: Props) => (
  <Link href={href} scroll={false} {...linkProps}>
    {children}
  </Link>
);

export default WrappedLink;
