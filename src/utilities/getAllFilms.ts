import { Film } from "./getFilmById";
import connect from "./connect";

export default async function getAllFilms(
  limit: number,
  sortDirection: "asc" | "desc"
): Promise<Film[]> {
  if (sortDirection !== "asc" && sortDirection !== "desc") {
    throw new Error("Not a valid sort direction for getAllFilms.");
  }

  const db = connect();
  const result = await db.query<Film>(
    `SELECT * FROM films ORDER BY film_id ${sortDirection} LIMIT $1`,
    [limit]
  );
  return result.rows;
}
