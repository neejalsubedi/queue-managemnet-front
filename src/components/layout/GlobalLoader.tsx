import { useEffect, useState, useRef } from "react";
import { onGlobalLoading } from "@/utility/loadingBus";
import { LoadingData } from "@/helper/loadingData";

export default function GlobalLoader() {
  const [shouldShow, setShouldShow] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const unsubscribe = onGlobalLoading((on) => {
      if (on) {
        // Wait before showing loader (prevents flicker)
        timeoutRef.current = window.setTimeout(() => {
          setShouldShow(true);
          document.body.style.overflow = "hidden";
        }, 200);
      } else {
        // Hide loader immediately
        setShouldShow(false);

        // Restore scroll
        document.body.style.overflow = "";

        // Clear any pending timeouts
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    });

    return () => {
      unsubscribe();
      document.body.style.overflow = ""; // Safety reset
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return shouldShow ? <LoadingData /> : null;
}
