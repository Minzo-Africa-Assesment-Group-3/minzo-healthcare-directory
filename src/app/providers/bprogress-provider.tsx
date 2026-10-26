"use client";

import type React from "react";
import { ProgressProvider } from "@bprogress/next/app";

const Nprogressprovider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProgressProvider
      height="5px"
      color="#0C486D"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};

export default Nprogressprovider;