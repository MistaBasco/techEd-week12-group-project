import connect from "@/utilities/connect";
import { Activity } from "../page";
import ActivityComponent from "@/components/ActivityComponent";

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  async function getActivityById(activity_id: number): Promise<Activity> {
    const db = connect();
    const result = await db.query(
      `SELECT * FROM activities WHERE activity_id = $1`,
      [activity_id]
    );
    return result.rows[0];
  }

  const activity_id = (await params).id;
  const activity = await getActivityById(activity_id);

  return <ActivityComponent activity={activity} showComments />;
}
