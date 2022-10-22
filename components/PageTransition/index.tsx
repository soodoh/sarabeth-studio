import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { savePageStyles } from "./tempFix";
import type { ReactNode } from "react";

type Props = { children: ReactNode };

const Component = ({ children }: Props) => {
  const router = useRouter();

  useEffect(() => savePageStyles(), []);

  useEffect(() => {
    const handleDone = () => {
      // setTimeout to execute after transition is handleDone
      setTimeout(() => {
        savePageStyles();
      }, 1000);
    };
    router.events.on("routeChangeComplete", handleDone);
    return () => {
      router.events.off("routeChangeComplete", handleDone);
    };
  }, [router]);

  return (
    <div>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={router.asPath}
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
