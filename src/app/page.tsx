import { Box, Flex, Image, Text, Link } from "@chakra-ui/react";
import { SignedOut } from "@clerk/nextjs";
import Splashpage from "@/components/Splashpage";

export default function Home() {
  return (
    <Box as="main" bg="gray.100" minH="100vh" py={8} px={[4, 8, 16]}>
      <SignedOut>
        <Splashpage />
      </SignedOut>

      {/*------------------- Film Banner Image------------------ */}
      <Flex direction="column" align="center" justify="center" mt={8} mb={16}>
        <Image
          src="/path/to/film-banner.jpg"
          alt="Film Head Image"
          borderRadius="md"
          objectFit="cover"
          w="full"
          maxW="1200px"
          h={["200px", "300px", "400px"]}
        />
      </Flex>

      {/* ---------------------------Content Sections----------------------- */}
      <Flex direction="column" align="center" maxW="1200px" mx="auto" mb={16}>
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

      {/* --------------------------------Footer Section ---------------------*/}
      <Flex
        as="footer"
        bg="gray.700"
        color="white"
        py={4}
        justify="center"
        align="center"
        mt={8}
        direction="column"
      >
        <Text fontSize="sm" mb={2}>
          Overrated - The Film Social Media App
        </Text>
        <Flex gap={4}>
          <Link href="/about" _hover={{ color: "yellow.300" }}>
            About
          </Link>
          <Link href="/contact" _hover={{ color: "yellow.300" }}>
            Contact
          </Link>
          <Link href="/social" _hover={{ color: "yellow.300" }}>
            Social
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}
