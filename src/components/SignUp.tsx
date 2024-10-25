import { SignUp } from "@clerk/nextjs";

interface SignUpProps {
  // Define any props here if needed
}

function SignUpComponent(props: SignUpProps) {
  return (
    <>
      <SignUp />
    </>
  );
}

export default SignUpComponent;
