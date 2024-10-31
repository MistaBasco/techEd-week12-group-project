"use client";
import { Box, Heading, Link as ChakraLink } from "@chakra-ui/react";

export default function FooterLinks() {
  return (
    <Box p={8} textAlign="center">
      <Heading as="h2" size="md" mb={4}>
        Links
      </Heading>
      <Box>
        <ChakraLink
          href="https://www.imdb.com"
          target="_blank"
          rel="noopener noreferrer"
          mb={3}
          display="block"
        >
          IMDb - Movie Database
        </ChakraLink>
        <ChakraLink
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
          mb={3}
          display="block"
        >
          TMDb - The Movie Database
        </ChakraLink>
        <ChakraLink
          href="https://www.reddit.com/r/movies/"
          target="_blank"
          rel="noopener noreferrer"
          mb={3}
          display="block"
        >
          Reddit Movies Community
        </ChakraLink>
        <ChakraLink
          href="https://www.boredpanda.com/"
          target="_blank"
          rel="noopener noreferrer"
          mb={3}
          display="block"
        >
          Bored Panda - Random Fun Articles
        </ChakraLink>
        <ChakraLink
          href="https://www.zombo.com/"
          target="_blank"
          rel="noopener noreferrer"
          mb={3}
          display="block"
        >
          Zombo.com - The Limitless Website
        </ChakraLink>
        <ChakraLink
          href="https://theuselessweb.com/"
          target="_blank"
          rel="noopener noreferrer"
          display="block"
        >
          The Useless Web - Find Something Weird
        </ChakraLink>
      </Box>
    </Box>
  );
}
