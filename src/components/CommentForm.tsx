"use client";
import { useState } from "react";
import CommentFormInput from "./CommentFormInput";
import { Button } from "@chakra-ui/react";

export default function PostComment({
  submitComment,
  activity_id,
}: {
  submitComment: (myData: string, activity_id: number) => void;
  activity_id: number;
}) {
  const [formData, setFormData] = useState({
    username: "",
    comment: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    const commentData = new FormData(event.currentTarget);
    const myData = commentData.get("comment");

    try {
      submitComment(myData as string, activity_id);

      console.log("Comment successfully posted:", myData);

      setFormData({ username: "", comment: "" });
      event.currentTarget.reset();
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData({
      ...formData,
      [event.currentTarget.name]: event.currentTarget.value,
    });
  }

  return (
    <>
      <form
        method="POST"
        onSubmit={handleSubmit}
        className="flex flex-col bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <CommentFormInput
          onChange={handleChange}
          placeholder="Enter your comment..."
          value={formData.comment}
        />
        <Button
          type="submit"
          colorScheme="blue"
          size="md"
          fontWeight="bold"
          w="full"
          _hover={{ bg: "blue.600", transform: "scale(1.03)" }}
          transition="transform 0.2s ease-in-out, background-color 0.2s"
          // isLoading={isSubmitting}
          disabled={formData.comment.length < 1}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </>
  );
}
