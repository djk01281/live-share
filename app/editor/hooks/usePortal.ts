import { useEffect } from "react";

export function usePortal(
  element: HTMLElement | undefined,
  portalId: string | undefined
) {
  useEffect(() => {
    if (portalId && element) {
      const target = document.getElementById(portalId);
      if (target) {
        target.innerHTML = "";
        target.appendChild(element);
      }
    }

    return () => {
      if (portalId && element) {
        const target = document.getElementById(portalId);
        if (target && target.contains(element)) {
          target.removeChild(element);
        }
      }
    };
  }, [portalId, element]);
}
