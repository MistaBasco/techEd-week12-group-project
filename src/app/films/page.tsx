import FilmGallery from "@/components/FilmGallery";
import getAllFilms from "@/utilities/getAllFilms";

export default async function AllFilmsPage() {
  // Get all films from database
  const films = await getAllFilms(50, "desc");
  return (
    <main className="absolute inset-0 overflow-y-auto w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <h1 className="text-3xl font-bold text-center pt-8">All Films</h1>
      <FilmGallery filmList={films} />
    </main>
  );
}
