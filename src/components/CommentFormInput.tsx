import React from "react";

type CommentFormInputProps = {
  onChange: React.ChangeEventHandler;
  placeholder: string;
  value: string;
};

export default function CommentFormInput({
  onChange,
  placeholder,
  value,
}: CommentFormInputProps) {
  return (
    <input
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className="p-4 rounded-md hover:shadow-lg hover:shadow-black"
    />
  );
}
