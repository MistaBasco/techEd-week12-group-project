import { getUserIdByClerkId } from "@/utilities/getUserByClerkId";
import { SignedIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function NavBar() {
  async function getUserId() {
    const myUser = await currentUser();
    return myUser ? await getUserIdByClerkId(myUser!.id) : null;
  }

  return (
    <nav className="flex h-full items-center justify-center gap-4 pl-2">
      <Link href="/">Home</Link>
      <Link href="/feed">Feed</Link>
      <Link href="/films">Films</Link>

      <SignedIn>
        <Link href={`/profile/${await getUserId()}`}>My Profile</Link>
      </SignedIn>
    </nav>
  );
}
