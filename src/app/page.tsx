import SplashPage from "@/components/Splashpage";
import { SignedOut } from "@clerk/nextjs";
import connect from "@/utilities/connect";
import { Pool } from "pg";

export default async function Home() {
  const posterPath = await fetchRandomPosterPath();

  return (
    <div>
      <SignedOut>
        <SplashPage posterPath={posterPath} />
      </SignedOut>
    </div>
  );
}

async function fetchRandomPosterPath() {
  let db: Pool | undefined;
  try {
    db = connect();
    await db.query("BEGIN");

    const idRangeResult = await db.query<{
      min_id: number | null;
      max_id: number | null;
    }>(
      "SELECT MIN(film_id) AS min_id, MAX(film_id) AS max_id FROM films WHERE poster_path IS NOT NULL"
    );

    const minId = idRangeResult.rows[0].min_id;
    const maxId = idRangeResult.rows[0].max_id;

    if (minId === null || maxId === null) {
      await db.query("COMMIT");
      return "/placeholder.png";
    }

    let posterPath: string | null = null;
    const maxAttempts = 10;

    for (let attempts = 0; attempts < maxAttempts && !posterPath; attempts++) {
      const randomId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
      const filmResult = await db.query<{ poster_path: string }>(
        "SELECT poster_path FROM films WHERE film_id = $1 AND poster_path IS NOT NULL",
        [randomId]
      );

      if (filmResult.rows.length > 0) {
        posterPath = filmResult.rows[0].poster_path;
      }
    }

    await db.query("COMMIT");
    return posterPath || "/placeholder.png";
  } catch (error) {
    console.error("Error fetching film poster:", error);
    if (db) await db.query("ROLLBACK");
    return "/placeholder.png";
  }
}
