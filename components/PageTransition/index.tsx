import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React from "react";
import type { ReactNode } from "react";

type Props = { children: ReactNode };

const Component = ({ children }: Props) => {
  const { asPath } = useRouter();
  return (
    <div>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={asPath}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 40 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.5, ease: "easeInOut", type: "tween" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Component;
