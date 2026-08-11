import { Suspense } from "react";
import CheckoutSuccessClient from "./success-client";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container-page py-20">Loading…</div>}>
      <CheckoutSuccessClient />
    </Suspense>
  );
}
