import { Activity } from "@/app/feed/page";
import getFilmById from "@/utilities/getFilmById";
import getUsernameById from "@/utilities/getUsernameById";
import Timestamp from "./Timestamp";

export default async function ActivityComponent({
  activity,
}: {
  activity: Activity;
}) {
  const {
    activity_id,
    user_id,
    film_id,
    activity_body,
    activity_type,
    created_at,
  } = activity;
  const username = await getUsernameById(user_id);
  const film = await getFilmById(film_id);
  let verb = "";
  if (activity_type === "watch") {
    verb = "watched";
  } else if (activity_type === "wtw") {
    verb = "added to their want-to-watch list";
  } else if (activity_type === "watch_from_wtw") {
    verb = "watched their wanted film";
  }
  return (
    <>
      <p id={`activity#${activity_id}`}>
        {username} {verb} {film.title}
      </p>
      <Timestamp timestamp={created_at} />
      {activity_body ? (
        <p>
          {username}: {activity_body}
        </p>
      ) : (
        <></>
      )}
    </>
  );
}
