"use client";
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
    <form onSubmit={onSubmit}>
      <label htmlFor="">First Name</label>
      <Input name="firstName" placeholder="First Name" />
      <label htmlFor="">Last Name</label>
      <Input name="lastName" placeholder="Last Name" />
      <label htmlFor="">Bio</label>
      <Textarea name="bio" placeholder="Bio" />
      <button type="submit">Update Profile</button>
    </form>
  );
}
