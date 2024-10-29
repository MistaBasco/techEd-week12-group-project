import Splashpage from "@/components/Splashpage";
import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";




export default function Home() {
  return (
    <div>
      <SignedOut>
        <Splashpage/>
      </SignedOut>
    </div>
  );
}
