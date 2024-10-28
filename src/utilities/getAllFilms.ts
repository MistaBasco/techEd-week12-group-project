import { Film } from "./getFilmById";
import connect from "./connect";

export default async function getAllFilms(): Promise<Film[]> {
  const db = connect();
  const result = await db.query<Film>(
    `SELECT * FROM films ORDER BY film_id ASC`
  );
  return result.rows;
}
