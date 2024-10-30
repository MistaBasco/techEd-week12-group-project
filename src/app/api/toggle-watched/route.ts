import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import toggleWatchedList from "@/utilities/toggleWatchedList";
import { getUserIdByClerkId } from "@/utilities/getUserByClerkId";

export async function POST(req: NextRequest) {
  try {
    const { filmId } = await req.json();
    if (!filmId) {
      return NextResponse.json(
        { message: "Film ID is required" },
        { status: 400 }
      );
    }

    const user = await currentUser();
    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = await getUserIdByClerkId(user.id);
    const action = await toggleWatchedList({ userId, filmId });
    return NextResponse.json({ message: `Film successfully ${action}` });
  } catch (error) {
    console.error("Error toggling watched status:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
