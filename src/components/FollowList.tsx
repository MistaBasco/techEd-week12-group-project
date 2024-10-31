import { getAllFollows, User } from "@/utilities/followFuncs";
import Link from "next/link";

export default async function FollowList({ user_id }: { user_id: number }) {
  return (
    <div>
      {(await getAllFollows(user_id)).map((entry: User) => {
        return (
          <div key={entry.user_id}>
            <p>
              <Link href={`/profile/${entry.user_id}`}>{entry.username}</Link>
            </p>
          </div>
        );
      })}
    </div>
  );
}
