import { FormEvent } from "react";
import { Input, Textarea } from "@chakra-ui/react";
import { updateProfile } from "@/utilities/updateProfile";

export default function EditProfile() {
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    updateProfile(formData);
  }

  return (
    // <Box
    //   as="form"
    //   onSubmit={onSubmit}
    //   bg="white"
    //   shadow="md"
    //   p={8}
    //   rounded="md"
    // >
    <>
      {/* <form onSubmit={onSubmit}>
        <FormControl id="firstName" mb={4}>
          <FormLabel>First Name</FormLabel>
          <Input name="firstName" placeholder="First Name" />
        </FormControl>
        <FormControl id="lastName" mb={4}>
          <FormLabel>Last Name</FormLabel>
          <Input name="lastName" placeholder="Last Name" />
        </FormControl>
        <FormControl id="bio" mb={6}>
          <FormLabel>Bio</FormLabel>
          <Textarea name="bio" placeholder="Bio" />
        </FormControl>
        <Button type="submit" colorScheme="blue" w="full">
          Update Profile
        </Button>
      </form> */}

      <form onSubmit={onSubmit}>
        <label htmlFor="">First Name</label>
        <Input name="firstName" placeholder="First Name" />
        <label htmlFor="">Last Name</label>
        <Input name="lastName" placeholder="Last Name" />
        <label htmlFor="">Bio</label>
        <Textarea name="bio" placeholder="Bio" />
        <button type="submit">Update Profile</button>
      </form>
    </>
  );
}
