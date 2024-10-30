import connect from "./connect";

export type Film = {
  film_id: number;
  title: string;
  director?: string;
  overview?: string;
  poster_path?: string;
  vote_average: number;
  release_year?: number;
  created_at: Date;
  updated_at: Date;
};

export default async function getFilmById(film_id: number): Promise<Film> {
  const db = connect();
  const result = await db.query<Film>(
    `SELECT * FROM films WHERE film_id = $1`,
    [film_id]
  );
  const film = result.rows[0];
  return film;
}
