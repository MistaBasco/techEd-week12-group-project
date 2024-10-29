import Splashpage from "@/components/Splashpage";
import { SignedOut } from "@clerk/nextjs";




export default function Home() {
  return (
    <div>
      <SignedOut>
        <Splashpage/>
      </SignedOut>
    </div>
  );
}
