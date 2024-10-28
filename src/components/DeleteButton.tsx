"use client";

type DeleteButtonProps = {
  deleteFunc: (postId: number) => void;
  postId: number;
  postType: "activity" | "comment";
};

export default function DeleteButton({
  deleteFunc,
  postId,
  postType,
}: DeleteButtonProps) {
  async function handleDelete() {
    const confirmed = confirm(
      `Are you sure you want to delete this ${postType}?`
    );
    if (!confirmed) return;

    try {
      deleteFunc(postId);
    } catch (error) {
      console.error(`Error deleting ${postType}:`, error);
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="absolute top-2 right-2 text-black font-bold text-xl" // hidden group-hover:block
    >
      ×
    </button>
  );
}
