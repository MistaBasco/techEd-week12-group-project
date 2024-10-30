import { Button, Flex, Box, Text, AspectRatio } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import connect from "@/utilities/connect";
import { Pool } from "pg";
import { GetServerSideProps } from "next";

export default function SplashPage({ posterPath }: { posterPath: string }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Flex
        direction="column"
        align="center"
        justify="center"
        minH="100vh"
        bgImage="url('/background2.jpg')"
        backgroundPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        px={4}
      >
        {/* glass card */}
        <Flex
          direction={{ base: "column", md: "row" }}
          align="stretch"
          w={{ base: "100%", md: "80%", lg: "60%" }}
          maxW="800px"
          bg="rgba(255, 255, 255, 0.1)"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="lg"
          border="1px solid rgba(255, 255, 255, 0.3)"
          position="relative"
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            bg: "inherit",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* welcome text */}
          <Box flex="1" p={6} color="white" position="relative">
            <Text
              fontSize={{ base: "3xl", md: "4xl" }}
              fontWeight="bold"
              mb={4}
            >
              Filum
            </Text>
            <Text fontSize="lg" mb={4}>
              Where every film is a new thread
            </Text>
            <Text fontSize="md" color="gray.200" mb={6}>
              Learn all there is to know about films and share with your
              friends.
            </Text>
            <Button
              size="md"
              rounded="full"
              bgGradient="linear(to-r, teal.400, blue.500)"
              color="white"
              _hover={{ bgGradient: "linear(to-r, blue.500, teal.400)" }}
            >
              Learn More
            </Button>
          </Box>

          {/* film poster */}
          <Box
            w={{ base: "100%", md: "33%" }}
            position="relative"
            flexShrink={0}
            overflow="hidden"
            borderBottomRadius={{ base: "lg", md: "none" }}
            borderRightRadius={{ base: "none", md: "lg" }}
          >
            <AspectRatio ratio={2 / 3} w="100%">
              <Image
                src={posterPath}
                alt="Film Poster"
                layout="fill"
                objectFit="cover"
              />
            </AspectRatio>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  let db: Pool | undefined;

  try {
    db = connect();

    await db.query("BEGIN");

    // get ids for poster_path not null
    const idRangeResult = await db.query<{
      min_id: number | null;
      max_id: number | null;
    }>(
      "SELECT MIN(id) AS min_id, MAX(id) AS max_id FROM films WHERE poster_path IS NOT NULL"
    );

    const minId = idRangeResult.rows[0].min_id;
    const maxId = idRangeResult.rows[0].max_id;

    if (minId === null || maxId === null) {
      // no films with poster_path found
      await db.query("COMMIT");
      return {
        props: {
          posterPath: "/placeholder.png",
        },
      };
    }

    let posterPath: string | null = null;
    let attempts = 0;
    const maxAttempts = 10;

    while (!posterPath && attempts < maxAttempts) {
      attempts++;

      // make random id between minId and maxId
      const randomId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;

      // try to fetch the film with the random ID
      const filmResult = await db.query<{ poster_path: string }>(
        "SELECT poster_path FROM films WHERE id = $1 AND poster_path IS NOT NULL",
        [randomId]
      );

      if (filmResult.rows.length > 0) {
        posterPath = filmResult.rows[0].poster_path;
      }
    }

    await db.query("COMMIT");

    if (!posterPath) {
      // could not find a film after maxAttempts
      return {
        props: {
          posterPath: "/placeholder.png",
        },
      };
    }

    return {
      props: {
        posterPath,
      },
    };
  } catch (error) {
    if (db) {
      await db.query("ROLLBACK");
    }
    console.error("Error fetching film poster soz", error);
    return {
      props: {
        posterPath: "/placeholder.png",
      },
    };
  } finally {
    if (db) {
      await db.end();
    }
  }
};
