// log-activity/route.ts
import { NextRequest, NextResponse } from "next/server";
import connect from "@/utilities/connect";
import { currentUser } from "@clerk/nextjs/server";
import { getUserIdByClerkId } from "@/utilities/getUserByClerkId";

export async function POST(req: NextRequest) {
  try {
    const { filmId, activityType } = await req.json();
    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = await getUserIdByClerkId(user.id);

    if (!filmId || !activityType) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = connect();
    // Check if the activity already exists
    await db.query(
      `SELECT 1 FROM activities WHERE user_id = $1 AND film_id = $2 AND activity_type = $3`,
      [userId, filmId, activityType]
    );

    // if (
    //   existingActivity?.rowCount !== null &&
    //   existingActivity?.rowCount !== undefined &&
    //   existingActivity.rowCount > 0
    // ) {
    //   return NextResponse.json(
    //     { message: "Activity already exists" },
    //     { status: 200 }
    //   );
    // }

    await db.query(
      `INSERT INTO activities (user_id, film_id, activity_body, activity_type) VALUES ($1, $2, $3, $4)`,
      [
        userId,
        filmId,
        activityType === "watch"
          ? `Watched film with ID: ${filmId}`
          : activityType === "wtw"
          ? `Added to Watchlist film with ID: ${filmId}`
          : `Removed from list film with ID: ${filmId}`,
        activityType,
      ]
    );

    return NextResponse.json(
      { message: "Activity logged successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error logging activity:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
