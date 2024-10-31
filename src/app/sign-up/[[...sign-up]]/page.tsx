import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="fixed flex items-center justify-center h-full w-full">
      <SignUp />
    </div>
  );
}
