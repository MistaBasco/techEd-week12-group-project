import UserProfile from "@/components/UserProfile";
import { notFound } from "next/navigation";

export default async function IndividualProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // check that the id from the url is a number, else boot user out into not-found page
  const user_id = Number((await params).id);
  if (Number.isNaN(user_id)) {
    notFound();
  }
  return <UserProfile user_id={user_id} />;
}
