import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function NavBar() {
  const user = await currentUser();
  const username = user?.username; // TODO use context when available
  return (
    <nav className="flex h-full items-center justify-center gap-4 pl-4">
      <Link href="/">Home</Link>
      <Link href="/feed">Feed</Link>
      {username && <Link href={`/${username}`}>My Profile</Link>}
    </nav>
  );
}
