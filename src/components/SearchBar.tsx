"use client";
import { useRef, useState } from "react";
import { Input, Box, HStack } from "@chakra-ui/react";
import { InputGroup } from "./ui/input-group";
import { Film } from "@/utilities/getFilmById";
import debounce from "lodash/debounce";
import Link from "next/link";
import { LuSearch } from "react-icons/lu";
import searchTMDB from "@/utilities/searchTMDB";

export type TMDBFilm = {
  id: number;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
};

export default function SearchBar() {
  const [query, setQuery] = useState<string>("");
  const [films, setFilms] = useState<Film[]>([]);
  // const [error, setError] = useState<string | null>(null);

  const searchFilms = async (searchTerms: string) => {
    const result = await searchTMDB(searchTerms);
    setFilms(result);
    console.log(result);
  };

  // change number to limit how often search films can be called
  // useRef so that this variable persists between renders
  const debounceSearch = useRef(
    debounce((searchTerm: string) => searchFilms(searchTerm), 1000)
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    debounceSearch.current.cancel();

    // event.target.trim returns trimmed string and removes white space
    // if the user has deleted everything event.target.trim will return an empty string and will be read as false so we will do the else statement
    if (e.target.value.trim()) {
      debounceSearch.current(e.target.value);
    } else {
      setFilms([]);
    }
  }

  return (
    <Box p={4} maxW="lg" mx="auto">
      <HStack alignItems="center">
        <InputGroup startElement={<LuSearch />}>
          <Input
            placeholder="Search for a movie..."
            value={query}
            onChange={handleChange}
            bg="white"
            border="1px"
            borderColor="gray.300"
            borderRadius="md"
            size="md"
            height="full"
            _placeholder={{ color: "gray.500" }}
          />
        </InputGroup>
      </HStack>
      {/* {error && (
        <Text color="red.500" mt={4}>
          {error}
        </Text>
      )} */}
      {films.length > 0 ? (
        <div className="absolute bg-slate-50 text-black p-1">
          {films.map((film) => (
            <div key={film.film_id}>
              <Link href={`/films/${film.film_id}`}>
                {film.title}, {film.release_year}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </Box>
  );
}
