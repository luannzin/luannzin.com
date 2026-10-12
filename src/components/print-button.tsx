"use client";

import { PrintIcon } from "@/components/icons";
import { press } from "@/lib/classes";

// Opens the browser's print dialog; the page's print styles turn it into the
// paper version. Ctrl+P gets the same paper without this button.
export function PrintButton({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`${press} ${className}`}
    >
      <PrintIcon className="size-4" />
      {label}
    </button>
  );
}
