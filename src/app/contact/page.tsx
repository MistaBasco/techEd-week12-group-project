"use client";
import { Box, Heading, Text } from "@chakra-ui/react";

export default function Contact() {
  return (
    <Box p={8} maxW="800px" mx="auto" textAlign="center">
      <Heading as="h1" size="xl" mb={6}>
        Contact Us
      </Heading>
      <Text fontSize="lg" mb={6}>
        We need friends... please add us! Whether you have questions, movie
        recommendations, or just want to chat about the latest releases, we're
        here for it. Reach out, we’re ready to pretend we’re cool.
      </Text>

      <div
        style={{ fontSize: "1.125rem", textAlign: "left", marginTop: "1rem" }}
      >
        <p style={{ marginBottom: "1rem" }}>
          <strong>Email:</strong> contact@moviebuddies.com
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <strong>Phone:</strong> (555) 123-4567
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <strong>Address:</strong> 123 Movie Lane, Cine City, Filmville 90210
        </p>
        <p style={{ marginBottom: "1rem" }}>
          <strong>Office Hours:</strong> Mon-Fri, 9am - 5pm (or whenever we’re
          done rewatching our favorite movies)
        </p>
      </div>
    </Box>
  );
}
