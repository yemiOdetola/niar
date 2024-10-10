"use client";

import { useState, useEffect } from "react";
import { FailModal } from "./fail-modal";
// import { SubscriptionModal } from "./subscription-modal";
import { SuccessModal } from "./success-modal";


export const Modals = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <FailModal />
      <SuccessModal />
      {/* <SubscriptionModal /> */}
    </>
  );
};
