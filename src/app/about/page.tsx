"use client";
import { Box, Heading, Text, Image } from "@chakra-ui/react";

export default function About() {
  return (
    <Box>
      <Box p={0} m={0} w="100%">
        <Image
          src="https://theusofn.wordpress.com/wp-content/uploads/2015/10/superheroes-at-the-movies-wallpaper.jpg?w=1200&h=800&crop=1"
          alt="Banner"
          width="100%"
          height={{ base: "200px", md: "400px" }}
          objectFit="cover"
        />
      </Box>

      <Box px={8} py={12} maxW="800px" mx="auto" textAlign="center">
        <Heading as="h1" size="xl" mb={6}>
          About Us
        </Heading>
        <Text fontSize="lg" mb={4}>
          Welcome to our humble corner of the internet! Here at "Website Name,"
          we believe that scrolling endlessly for movies to watch (and then
          watching the same comfort movie again) is a lifestyle, not a choice.
          So, we made it our mission to help you dive deep, discover new
          favorites, and maybe even remember what you wanted to watch in the
          first place. With features that are both “cool” and “vaguely useful,”
          our site is a one-stop-shop for movie fans, snack enthusiasts, and
          professional procrastinators alike.
        </Text>
        <Text fontSize="lg" mb={4}>
          Our team? Just a bunch of overly caffeinated movie nerds who could
          tell you the exact frame count of every classic film... if you asked.
          So please, dive in, click around, and let’s get you set up with your
          next binge session. Who knows? By the time you leave, you might even
          find a new all-time favorite (or five). Happy scrolling!
        </Text>
      </Box>
    </Box>
  );
}
