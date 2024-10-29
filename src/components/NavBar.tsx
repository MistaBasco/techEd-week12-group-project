import { SignedIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";


export default async function NavBar() {
  async function getUsername() {
    const user = await currentUser();
    return user?.username; // TODO use context when available
  }

  return (
    <nav className="flex h-full items-center justify-center gap-4 pl-4">
      <Link href="/">Home</Link>
      <Link href="/feed">Feed</Link>
  
      <SignedIn>
        <Link href={`/${await getUsername()}`}>My Profile</Link>
        {/* TODO change this link when we make the profile page */}
      </SignedIn>
    </nav>
  );
}
