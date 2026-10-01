import { useState } from "react";
import { COPIED_FEEDBACK_MS } from "@gopvp/app/src/constants/limit";

export function useCopyToClipboard() {
 const [copied, setCopied] = useState(false);

 const copy = (text: string) =>
  navigator.clipboard.writeText(text).then(() => {
   setCopied(true);
   setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS);
  });

 return { copied, copy };
}
