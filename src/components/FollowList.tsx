import { getAllFollows, User } from "@/utilities/followFuncs";

export default async function FollowList({ user_id }: { user_id: number }) {
  return (
    <div>
      {(await getAllFollows(user_id)).map((entry: User) => {
        return (
          <div key={entry.user_id}>
            <p>{entry.username}</p>
          </div>
        );
      })}
    </div>
  );
}
