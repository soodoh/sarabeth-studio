import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
};

const WrappedLink = ({ href, children }: Props) => (
  <Link href={href} scroll={false}>
    {children}
  </Link>
);

export default WrappedLink;
