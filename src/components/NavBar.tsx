import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function NavBar() {
  const username = (await currentUser())!.username; // TODO use context when available
  return (
    <nav className="flex h-full items-center justify-center gap-4 pl-4">
      <Link href="/">Home</Link>
      <Link href="/feed">Feed</Link>
      <Link href={`/${username}`}>My Profile</Link>
    </nav>
  );
}
