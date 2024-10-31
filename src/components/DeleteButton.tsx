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
      className="relative top-4 right-1 mt-[-4px] mr-[-4px] text-gray-500 font-bold text-xl transform -translate-y-1/2 -translate-x-1/2" // hidden group-hover:block
    >
      ×
    </button>
  );
}
