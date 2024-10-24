import { SignUp } from "@clerk/nextjs";

interface SignUpProps {
  // Define any props here if needed
}

function SignInComponent(props: SignUpProps) {
  return (
    <>
      <SignUp />
    </>
  );
}

export default SignInComponent;
