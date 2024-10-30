"use server";
import connect from "./connect";
import { Film } from "./getFilmById";

// add it to the database if it isn't already there, either way return the Film from the database
export default async function addFilmToDB(film: Film): Promise<Film> {
  const { title, release_year } = film;
  const db = connect();
  // check if this film is in the database already
  const checkResult = await db.query<Film>(
    `SELECT * FROM films WHERE title = $1 AND release_year = $2`,
    [title, release_year]
  );
  // rowCount is not null for SELECT queries: https://node-postgres.com/apis/result#resultrowcount-int--null
  const isFilmAlreadyInDB = checkResult.rowCount! > 0;

  // exit early
  if (isFilmAlreadyInDB) {
    return checkResult.rows[0];
  }

  const { director, overview, poster_path, vote_average } = film;
  // insert film into the database
  const insertResult = await db.query<Film>(
    `INSERT INTO films (title, director, overview, poster_path, vote_average, release_year) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, director, overview, poster_path, vote_average, release_year]
  );
  console.log("Added ", title, "to films table.");
  return insertResult.rows[0];
}
