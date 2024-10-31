import { Button, Flex, Box, Text, AspectRatio } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";

interface SplashPageProps {
  posterPath: string;
}

export default function SplashPage({ posterPath }: SplashPageProps) {
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
                src={posterPath ? posterPath : "/placeholder.png"}
                alt="Film Poster"
                fill
                style={{ objectFit: "cover" }}
              />
            </AspectRatio>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
