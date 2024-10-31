import { Flex, Link, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
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
  );
}
