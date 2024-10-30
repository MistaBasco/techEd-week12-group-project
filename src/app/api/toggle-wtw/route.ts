import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import toggleWatchlist from "@/utilities/toggleWatchList";
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
    console.log("currentUser:", user);

    const clerkId = user?.id || "";
    const userId = await getUserIdByClerkId(clerkId);
    console.log("userId:", userId);

    if (!user || !user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const action = await toggleWatchlist({ userId, filmId });
    return NextResponse.json({ message: `Film successfully ${action}` });
  } catch (error) {
    console.error("Error toggling watch list:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
