import connect from "@/utilities/connect";

export async function checkWatchedListStatus(
  userId: number,
  filmId: number
): Promise<boolean> {
  const db = connect(); // Connect to the database
  try {
    const checkQuery = `
      SELECT 1 
      FROM watched_films
      WHERE user_id = $1 AND film_id = $2;
    `;
    const result = await db.query(checkQuery, [userId, filmId]);
    return typeof result?.rowCount === "number" && result.rowCount > 0;
  } catch (error) {
    console.error("Error fetching watched list status:", error);
    return false; // Default to not in the watched list if there's an error
  }
}
