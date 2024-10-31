"use server";

type TMDBCreditsResult = {
  id: number;
  crew: { name: string; job: string }[];
};

export default async function getDirectorFromTMDB(
  tmbd_id: number
): Promise<string> {
  const API_KEY = process.env.TMDB_API_KEY;
  const url = `https://api.themoviedb.org/3/movie/${tmbd_id}/credits?api_key=${API_KEY}`;
  const response = await fetch(url);
  const data = (await response.json()) as TMDBCreditsResult;
  const director = data.crew.find((person) => person.job === "Director");
  return director?.name || "";
}
