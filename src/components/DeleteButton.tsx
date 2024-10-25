"use client";

type DeleteButtonProps = {
  deleteFunc: (postId: number) => void;
  postId: number;
};

export default function DeleteButton({
  deleteFunc,
  postId,
}: DeleteButtonProps) {
  async function handleDelete() {
    const confirmed = confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      deleteFunc(postId);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="absolute top-2 right-2 text-grey-300 font-bold text-xl hidden group-hover:block"
    >
      ×
    </button>
  );
}
