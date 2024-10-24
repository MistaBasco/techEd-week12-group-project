import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex h-full items-center justify-center gap-4 pl-4">
      <Link href="/">Home</Link>
      <Link href="/feed">Feed</Link>
      <Link href="/profile">My Profile</Link>
    </nav>
  );
}
