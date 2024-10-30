import { FormEvent } from "react";
import { Box, Button, FormControl, FormLabel, Input, Textarea } from "@chakra-ui/react";
import connect from "@/utilities/connect";

type FormData = {
  firstName: string;
  lastName: string;
  bio: string;
};

export default function EditProfile() {
//   async function handleUpdateProfile(formData: FormData) {
//     "use server";
//     const db = connect();

    
//     const { firstName, lastName, bio } = formData;
//     try {
//       // await db.query("UPDATE users SET first_name = $1, last_name = $2, bio = $3 WHERE id = $4", [firstName, lastName, bio, userId]);
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     }
//   }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: FormData = {
      firstName: (e.currentTarget.elements.namedItem("firstName") as HTMLInputElement).value,
      lastName: (e.currentTarget.elements.namedItem("lastName") as HTMLInputElement).value,
      bio: (e.currentTarget.elements.namedItem("bio") as HTMLTextAreaElement).value,
    };
    handleUpdateProfile(formData);
  };

  return (
    <Box as="form" onSubmit={onSubmit} bg="white" shadow="md" p={8} rounded="md">
      <FormControl id="firstName" mb={4}>
        <FormLabel>First Name</FormLabel>
        <Input
          name="firstName"
          placeholder="First Name"
          
        />
      </FormControl>
      <FormControl id="lastName" mb={4}>
        <FormLabel>Last Name</FormLabel>
        <Input
          name="lastName"
          placeholder="Last Name"
        
        />
      </FormControl>
      <FormControl id="bio" mb={6}>
        <FormLabel>Bio</FormLabel>
        <Textarea
          name="bio"
          placeholder="Bio"
          
        />
      </FormControl>
      <Button type="submit" colorScheme="blue" w="full">
        Update Profile
      </Button>
    </Box>
  );
}
