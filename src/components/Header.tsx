import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavBar from "./NavBar";
// import SignInComponent from "./SignIn";
// import SignUpComponent from "./SignUp";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 flex h-8 bg-slate-400 items-center">
      <h1 className="font-bold m-2 text-2xl">Overrated&trade;</h1>
      <NavBar />
      {/* searchbar */}
      <div className="flex-1"></div>
      <div className="flex gap-2 m-2">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link href="/sign-in/">Sign In</Link>
          <Link href="/sign-up/">Sign Up</Link>
        </SignedOut>
      </div>
    </header>
  );
}
