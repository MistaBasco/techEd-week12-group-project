import Link from "next/link";

export default function NotFound() {
  return (
    <div className="m-4">
      <h2>Not Found</h2>
      <p>That page does not exist</p>
      <Link href="/" className="underline">
        Return Home
      </Link>
    </div>
  );
}
