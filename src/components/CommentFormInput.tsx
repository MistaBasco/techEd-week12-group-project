"use client";
import { ChangeEvent } from "react";

type CommentFormInputProps = {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  value: string;
  className?: string;
};

export default function CommentFormInput({
  onChange,
  placeholder,
  value,
  className,
}: CommentFormInputProps) {
  return (
    <input
      type="text"
      name="comment"
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      className={`w-full border border-gray-300 rounded-lg p-3 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out ${className}`}
    />
  );
}
