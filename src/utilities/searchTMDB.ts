import addFilmToDB from "./addFilmToDB";
import { Film } from "./getFilmById";

export type TMDBFilm = {
  id: number;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
};

export default async function searchTMDB(query: string): Promise<Film[]> {
  const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}`;
  console.log(url);

  const response = await fetch(url);
  const data = await response.json();
  if (data.results) {
    const newData = await Promise.all(
      data.results.map(async (element: TMDBFilm): Promise<Film> => {
        const release_year = element.release_date
          ? Number(element.release_date.substring(0, 4))
          : undefined;
        if (element.poster_path) {
          element.poster_path =
            "https://image.tmdb.org/t/p/w600_and_h900_bestv2" +
            element.poster_path;
        } else {
          element.poster_path = "/placeholder.png";
        }
        const created_at = new Date();
        const updated_at = created_at;
        const film_id = -1;
        const output = await addFilmToDB({
          ...element,
          release_year: release_year,
          created_at: created_at,
          updated_at: updated_at,
          film_id: film_id,
        });
        return output;
      })
    );
    return newData;
  }
  return [];
}