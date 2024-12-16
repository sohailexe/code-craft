"use client";
import React, { useEffect } from "react";
import { useState } from "react";

const useMounted = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, [mounted]);

  return mounted;
};

export default useMounted;
