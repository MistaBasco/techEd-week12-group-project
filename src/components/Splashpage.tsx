import { Button, Flex, Box, Text } from "@chakra-ui/react";

export default function SplashPage() {
  return (
    <Flex direction="column" align="center" minH="100vh" bg="gray.50">
      {/* CTA/Gallery? not quite sure what is needed here. CTA is a button right now and gallery can be images or text. */}
      <Flex direction="column" align="center" py={8} px={4} textAlign="center">
        <Button size="lg" mb={8}>CTA</Button>

        <Flex wrap="wrap" justify="center" gap={4} maxW="4xl">
         
          <Box w={{ base: "full", md: "48" }} h="64" bg="gray.200" textAlign="center">
            <Text mt={2}>Placeholder Text</Text>
          </Box>
          <Box w={{ base: "full", md: "48" }} h="64" bg="gray.200" textAlign="center">
            <Text mt={2}>Placeholder Text</Text>
          </Box>
          <Box w={{ base: "full", md: "48" }} h="64" bg="gray.200" textAlign="center">
            <Text mt={2}>Placeholder Text</Text>
          </Box>
          <Box w={{ base: "full", md: "48" }} h="64" bg="gray.200" textAlign="center">
            <Text mt={2}>Placeholder Text</Text>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
}
