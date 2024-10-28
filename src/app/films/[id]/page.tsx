import getFilmById from "@/utilities/getFilmById";
import FilmCard from "@/components/FilmCard";
import { Film } from "@/utilities/getFilmById";

interface FilmPageProps {
  params: {
    id: string;
  };
}

export default async function FilmPage({ params }: FilmPageProps) {
  const filmId = Number(params.id);

  // Get film server side
  const film = await getFilmById(filmId);

  if (!film) {
    return <div>Film not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <FilmCard films={film} />
    </div>
  );
}
