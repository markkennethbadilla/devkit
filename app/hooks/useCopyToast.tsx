"use client";

import { useState, useCallback } from "react";

export default function useCopyToast() {
  const [show, setShow] = useState(false);

  const copy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setShow(true);
    setTimeout(() => setShow(false), 2000);
  }, []);

  const Toast = () =>
    show ? <div className="copy-toast">Copied to clipboard!</div> : null;

  return { copy, Toast };
}
