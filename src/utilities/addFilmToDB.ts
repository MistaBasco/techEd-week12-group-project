"use server";
import connect from "./connect";
import getDirectorFromTMDB from "./getDirectorFromTMDB";
import { Film } from "./getFilmById";

// add it to the database if it isn't already there, either way return the Film from the database
export default async function addFilmToDB(film: Film): Promise<Film> {
  const { tmdb_id } = film;
  const db = connect();
  // check if this film is in the database already
  const checkResult = await db.query<Film>(
    `SELECT * FROM films WHERE tmdb_id = $1`,
    [tmdb_id]
  );
  // rowCount is not null for SELECT queries: https://node-postgres.com/apis/result#resultrowcount-int--null
  const isFilmAlreadyInDB = checkResult.rowCount! > 0;

  // exit early
  if (isFilmAlreadyInDB) {
    return checkResult.rows[0];
  }

  const { overview, poster_path, vote_average, title, release_year } = film;
  let director = "";
  if (!film.director) {
    director = await getDirectorFromTMDB(tmdb_id!);
  } else {
    director = film.director;
  }

  // insert film into the database
  const insertResult = await db.query<Film>(
    `INSERT INTO films (title, director, overview, poster_path, vote_average, release_year, tmdb_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      title,
      director,
      overview,
      poster_path,
      vote_average,
      release_year,
      tmdb_id,
    ]
  );
  console.log("Added ", title, "to films table.");
  return insertResult.rows[0];
}
