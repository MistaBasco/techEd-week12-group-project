"use server";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/utilities/connect";
import { auth } from "@clerk/nextjs/server";
import { getUserIdByClerkId } from "@/utilities/getUserByClerkId";

export async function POST(req: NextRequest) {
  "use server";
  try {
    const { filmId, activityType, postUserId = null } = await req.json();
    console.log("Received data for logging activity:", {
      filmId,
      activityType,
    });
    const clerkId = postUserId;
    const user = await auth();
    console.log("ClerkId : " + clerkId);
    console.log("USER OBJECT : " + user);

    if (!user || !clerkId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = await getUserIdByClerkId(clerkId);

    if (!filmId || !activityType) {
      console.error("Missing required fields", { filmId, activityType });
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = connect();
    // Check if the activity already exists
    const existingActivity = await db.query(
      `SELECT 1 FROM activities WHERE user_id = $1 AND film_id = $2 AND activity_type = $3`,
      [userId, filmId, activityType]
    );

    if (
      existingActivity &&
      existingActivity?.rowCount !== null &&
      existingActivity?.rowCount !== undefined &&
      existingActivity.rowCount > 0
    ) {
      console.log("Activity already exists for user, film, and type", {
        userId,
        filmId,
        activityType,
      });
      return NextResponse.json(
        { message: "Activity already exists" },
        { status: 200 }
      );
    }

    // Validate input values before inserting
    const validActivityTypes = ["watch", "wtw", "watch_from_wtw"];
    if (!validActivityTypes.includes(activityType)) {
      console.error("Invalid activity type", { activityType });
      return NextResponse.json(
        { message: "Invalid activity type" },
        { status: 400 }
      );
    }

    await db.query(
      `INSERT INTO activities (user_id, film_id, activity_type) VALUES ($1, $2, $3)`,
      [userId, filmId, activityType]
    );

    console.log("Activity logged successfully");
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
