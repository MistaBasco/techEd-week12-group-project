"use client"

import React, { useState } from "react";
import { Input, Button, Box, VStack, Text, HStack } from "@chakra-ui/react";
import { Film } from "@/utilities/getFilmById";
import FilmCard from "./FilmCard";
import debounce from "lodash/debounce"

type TMDBFilm = {
  id: number;
  overview: string;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
}

export default function SearchBar() {
  const [query, setQuery] = useState<string>("");
  const [films, setFilms] = useState<(TMDBFilm & Film)[]>([]);
  const [error, setError] = useState<string | null>(null);


  const searchFilms = async (searchTerms:string) => {
    setError(null);
    const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?query=${searchTerms}&api_key=${API_KEY}`;

    console.log(url)

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data)
      if (data.results) {
        data.results.forEach((element: TMDBFilm & Film) => {
          element.release_year = Number(element.release_date.substring(0, 4));
          element.poster_path = "https://image.tmdb.org/t/p/w600_and_h900_bestv2" + element.poster_path;
        })
        setFilms(data.results);
      } else {
        setFilms([])
      //   setError("Please Try Again");
      }
    } catch (err) {
      setError("Failed to fetch movies. Please try again later.");
    }
  };
// change number to limit how often search films can be called
  const debounceSearch = debounce((searchTerm:string)=>searchFilms(searchTerm), 300)
  function  handleChange(e:React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
   
    // event.target.trim returns trimmed string and removes white space
    // if the user has deleted everything event.target.trim will return an empty string and will be read as false so we will do the else statement
    if(e.target.value.trim()){
      debounceSearch(e.target.value)
    } else {
      setFilms([])
    }
  }
  return (
    <Box  p={4} maxW="lg" mx="auto">
      <HStack alignItems="center">
        <Input
          placeholder="Search for a movie..."
          value={query}
          onChange={handleChange}
          bg="white"
          border="1px"
          borderColor="gray.300"
          borderRadius="md"
          size="md"
          _placeholder={{ color: "gray.500" }}
        />
        <Button colorScheme="teal" size="md">
          Search
        </Button>
      </HStack>
      {error && (
        <Text color="red.500" mt={4}>
          {error}
        </Text>
      )}
      {films.map((film) => (
        <FilmCard key={film.id} film={film} />
      ))}
     
    </Box>
  );
}