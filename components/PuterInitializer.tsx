"use client";

import { usePuterStore } from "@/lib/puter";
import { useEffect } from "react";


export default function PuterInitializer() {
  const { init } = usePuterStore();

  useEffect(() => {
    init();
  }, [init]);

  return null; // no UI, just runs init
}
