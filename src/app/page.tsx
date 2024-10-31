import SplashPage from "@/components/Splashpage";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import connect from "@/utilities/connect";
import { Pool } from "pg";
import { Box, Flex, Image, Text, Link } from "@chakra-ui/react";

export default async function Home() {
  const posterPath = await fetchRandomPosterPath();
  return (
    <>
      <SignedOut>
        <SplashPage posterPath={posterPath} />
      </SignedOut>
      <SignedIn>
        <Box bg="gray.100" minH="100vh" py={8} px={[4, 8, 16]}>
          {/*------------------- Film Banner Image------------------ */}
          <Flex
            direction="column"
            align="center"
            justify="center"
            mt={8}
            mb={16}
          >
            <Image
              src="URL HERE"
              alt="Film Head Image"
              borderRadius="md"
              objectFit="cover"
              w="full"
              maxW="1200px"
              h={["200px", "300px", "400px"]}
            />
          </Flex>

          {/* ---------------------------Content Sections----------------------- */}
          <Flex
            direction="column"
            align="center"
            maxW="1200px"
            mx="auto"
            mb={16}
          >
            {/*--------------------- Top Films Section -------------------------*/}
            <Box w="100%" mb={8}>
              <Text fontSize="lg" fontWeight="bold" textAlign="center" mb={4}>
                Most Recent Films
              </Text>
              <Flex justify="center" wrap="wrap" gap={4}>
                {[1, 2, 3, 4].map((film) => (
                  <Box
                    key={film}
                    w="150px"
                    h="200px"
                    bg="gray.300"
                    borderRadius="md"
                    overflow="hidden"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Image
                      src={`/path/to/film${film}.jpg`}
                      alt={`Top Film ${film}`}
                      objectFit="cover"
                      w="full"
                      h="full"
                    />
                    <Text fontSize="sm" textAlign="center" mt={2}></Text>
                  </Box>
                ))}
              </Flex>
            </Box>

            {/*----------------  Divider ---------------------*/}
            <Box
              as="hr"
              width="80%"
              borderTop="1px solid"
              borderColor="gray.400"
              my={8}
            />

            {/* --------------- Features Section----------------- */}
            <Box textAlign="center" mb={8}>
              <Text fontSize="lg" fontWeight="bold" mb={4}>
                Overrated lets you:
              </Text>
              <Flex justify="center" gap={8}>
                <Box textAlign="center">
                  <Image
                    src="https://e7.pngegg.com/pngimages/75/480/png-clipart-computer-icons-detective-investigation-miscellaneous-logo.png"
                    alt="See films"
                    boxSize="8"
                  />
                  <Text fontSize="sm" mt={2}>
                    Track your friend`s films
                  </Text>
                </Box>
                <Box textAlign="center">
                  <Image
                    src="https://e7.pngegg.com/pngimages/1021/749/png-clipart-facebook-like-icon-social-media-marketing-like-button-facebook-social-network-advertising-like-text-hand-thumbnail.png"
                    alt="Like films"
                    boxSize="8"
                  />
                  <Text fontSize="sm" mt={2}>
                    Like films
                  </Text>
                </Box>
                <Box textAlign="center">
                  <Image
                    src="https://e7.pngegg.com/pngimages/113/163/png-clipart-computer-icons-solar-calendar-time-google-calendar-calendar-time-text-calendar.png"
                    alt="Track watched"
                    boxSize="8"
                  />
                  <Text fontSize="sm" mt={2}>
                    Keep track of watched
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Flex>
        </Box>
      </SignedIn>
      {/* --------------------------------Footer Section ---------------------*/}
      <Flex
        as="footer"
        color="white"
        py={4}
        justify="center"
        align="center"
        direction="column"
        w="full"
        className="bg-slate-700"
      >
        <Text fontSize="sm" mb={2}>
          Overrated - The Film Social Media App
        </Text>
        <Flex gap={4}>
          <Link href="/about" _hover={{ color: "yellow.300" }}>
            About
          </Link>
          <Link href="/contact" _hover={{ color: "yellow.300" }}>
            Contact Us
          </Link>
          <Link href="/links" _hover={{ color: "yellow.300" }}>
            Links
          </Link>
        </Flex>
      </Flex>
    </>
  );
}

async function fetchRandomPosterPath() {
  let db: Pool | undefined;
  try {
    db = connect();
    await db.query("BEGIN");

    const idRangeResult = await db.query<{
      min_id: number | null;
      max_id: number | null;
    }>(
      "SELECT MIN(film_id) AS min_id, MAX(film_id) AS max_id FROM films WHERE poster_path IS NOT NULL"
    );

    const minId = idRangeResult.rows[0].min_id;
    const maxId = idRangeResult.rows[0].max_id;

    if (minId === null || maxId === null) {
      await db.query("COMMIT");
      return "/placeholder.png";
    }

    let posterPath: string | null = null;
    const maxAttempts = 10;

    for (let attempts = 0; attempts < maxAttempts && !posterPath; attempts++) {
      const randomId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;
      const filmResult = await db.query<{ poster_path: string }>(
        "SELECT poster_path FROM films WHERE film_id = $1 AND poster_path IS NOT NULL",
        [randomId]
      );

      if (filmResult.rows.length > 0) {
        posterPath = filmResult.rows[0].poster_path;
      }
    }

    await db.query("COMMIT");
    return posterPath || "/placeholder.png";
  } catch (error) {
    console.error("Error fetching film poster:", error);
    if (db) await db.query("ROLLBACK");
    return "/placeholder.png";
  }
}
