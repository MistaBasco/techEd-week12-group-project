import FilmCard from "@/components/FilmCard";
import { Film } from "@/utilities/getFilmById";

type FilmGalleryProps = {
  filmList: Film[];
};

export default function FilmGallery({ filmList }: FilmGalleryProps) {


  return (
    <div className="flex flex-wrap justify-center">
      {filmList.map((film) => (
        <FilmCard key={film.film_id} film={film} />
      ))}
    </div>
  );
}
