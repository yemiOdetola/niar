"use client";

import { useState, useEffect } from "react";
import { SubscriptionModal } from "@/components/features/subscription/subscription-modal";
import { SuccessModal } from "@/components/features/subscription/success-modal";
import { FailModal } from "@/components/features/subscription/fail-modal";


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
      <SubscriptionModal />
    </>
  );
};
