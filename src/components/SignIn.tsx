import { SignIn } from "@clerk/nextjs";

interface SignInProps {
  // Define any props here if needed
}

function SignInComponent(props: SignInProps) {
  return (
    <>
      <SignIn />
    </>
  );
}

export default SignInComponent;
