import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavBar from "./NavBar";
import Link from "next/link";
import SearchBar from "./SearchBar";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex items-center bg-slate-700 text-white shadow-md px-4 py-3">
      <h1 className="font-bold text-2xl mr-4 text-yellow-300">
        Overrated&trade;
      </h1>

      {/* -----------------Navigation Links ---------------*/}
      <NavBar />

      {/* --------------Centered Search Bar----------------- */}
      <div className="flex-1 px-4">
        <SearchBar />
      </div>

      {/*-------------- Authentication Links----------------- */}
      <div className="flex items-center gap-4">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <Link
            href="/sign-in"
            className="hover:text-yellow-300 transition duration-150 ease-in-out"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="hover:text-yellow-300 transition duration-150 ease-in-out"
          >
            Sign Up
          </Link>
        </SignedOut>
      </div>
    </header>
  );
}
