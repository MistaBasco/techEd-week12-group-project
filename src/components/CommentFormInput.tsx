import React from "react";

type CommentFormInputProps = {
  onChange: React.ChangeEventHandler;
  name: string;
  placeholder: string;
  value: string;
};

export default function CommentFormInput({
  onChange,
  name,
  placeholder,
  value,
}: CommentFormInputProps) {
  return (
    <input
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      className="p-4 rounded-md hover:shadow-lg hover:shadow-black"
    />
  );
}
