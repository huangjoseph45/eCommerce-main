import { useState } from "react";
import { isDemoCatalog } from "../data/demoCatalog";

// Shown while the storefront is serving the demo catalog because the live
// backend is unreachable. Browsing works; cart, accounts, and checkout need
// the live API, so the banner says so instead of letting checkout fail
// silently.
const DemoBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || !isDemoCatalog()) return null;

  return (
    <div className="w-full bg-bgSecondary text-textLight text-center text-sm px-4 py-2 flex items-center justify-center gap-3">
      <p>
        Demo catalog — the live store is offline, so you&apos;re browsing
        sample products. Cart and checkout need the live backend.
      </p>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss demo notice"
        className="shrink-0 underline underline-offset-2 hover:text-bgTertiary"
      >
        Dismiss
      </button>
    </div>
  );
};

export default DemoBanner;
