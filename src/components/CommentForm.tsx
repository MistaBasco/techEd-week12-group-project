"use client";
import { useState } from "react";
import CommentFormInput from "./CommentFormInput";

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
        className="flex flex-col bg-slate-400 p-16 gap-[13px]"
      >
        <CommentFormInput
          onChange={handleChange}
          placeholder="Enter comment here"
          value={formData.comment}
        />
        <button
          type="submit"
          className={`rounded p-4 ${
            formData.comment.length < 1 ? "bg-slate-500" : "bg-green-500"
          }`}
          disabled={isSubmitting || formData.comment.length < 1}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </>
  );
}
