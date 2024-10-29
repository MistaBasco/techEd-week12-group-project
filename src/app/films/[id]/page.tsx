import getFilmById from "@/utilities/getFilmById";
import FilmCard from "@/components/FilmCard";
import { notFound } from "next/navigation";

type FilmPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function FilmPage({ params }: FilmPageProps) {
  const filmId = Number((await params).id);

  // Get film server side
  const film = await getFilmById(filmId);

  if (!film) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <FilmCard film={film} />
    </div>
  );
}
