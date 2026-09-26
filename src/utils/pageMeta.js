import { useEffect } from "react";

export function usePageMeta(title, description) {
  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content") ?? "";

    document.title = title;
    if (meta && description) meta.setAttribute("content", description);

    return () => {
      document.title = previousTitle;
      if (meta) meta.setAttribute("content", previousDescription);
    };
  }, [title, description]);
}
