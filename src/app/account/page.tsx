import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser, destroySession } from "@/lib/auth/session";

async function logout() {
  "use server";
  await destroySession();
  redirect("/login");
}

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  return (
    <div className="container-page py-16">
      <p className="mb-3 text-sm font-medium text-[#0071e3]">Account</p>
      <h1 className="display text-5xl">Welcome back</h1>
      <p className="mt-4 text-[#6e6e73]">Signed in as {user.email}</p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Link href="/vault" className="panel p-5 transition hover:-translate-y-0.5">
          <p className="font-medium">License vault</p>
          <p className="mt-2 text-sm text-[#6e6e73]">Download packages with your keys.</p>
        </Link>
        <Link href="/products" className="panel p-5 transition hover:-translate-y-0.5">
          <p className="font-medium">Browse algorithms</p>
          <p className="mt-2 text-sm text-[#6e6e73]">Buy another system. Sales are final.</p>
        </Link>
        <Link href="/legal/refunds" className="panel p-5 transition hover:-translate-y-0.5">
          <p className="font-medium">No refunds</p>
          <p className="mt-2 text-sm text-[#6e6e73]">Review the refund policy anytime.</p>
        </Link>
      </div>

      <form action={logout} className="mt-10">
        <button type="submit" className="btn btn-secondary">
          Sign out
        </button>
      </form>
    </div>
  );
}
