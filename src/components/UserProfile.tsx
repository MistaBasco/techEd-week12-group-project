"use client";
import {
  Box,
  Button,
  Heading,
  VStack,
  Text,
  Image,
  Tabs,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuUser, LuFolder, LuCheckSquare } from "react-icons/lu";
import { useUser } from "@clerk/nextjs";

export default function UserProfile() {
  const { user } = useUser();
  const username = user?.username || "UserName";

  return (
    <Box
      p={{ base: 4, md: 8 }}
      bg="rgba(255, 255, 255, 0.1)"
      backdropFilter="blur(10px)"
      rounded="lg"
      boxShadow="lg"
      minH="100vh"
    >
      {/* Profile Section */}
      <VStack mt={4} align="center">
        <Image
          src={user?.imageUrl || "/profileplaceholder.jpg"}
          alt="User Profile Picture"
          boxSize={{ base: "80px", md: "100px" }}
          borderRadius="full"
          bg="gray.300"
        />
        <Heading size={{ base: "md", md: "lg" }} mt={4}>
          {username}
        </Heading>
        <Button
          variant="solid"
          colorScheme="teal"
          size="sm"
          px={6}
          mt={2}
          boxShadow="md"
          _hover={{ boxShadow: "lg", bg: "teal.600" }}
        >
          Edit Profile
        </Button>
      </VStack>

      {/* Tabs Section */}
      <Tabs.Root
        variant="soft-rounded"
        colorScheme="teal"
        defaultValue="editProfile"
        mt={8}
      >
        <Tabs.List justifyContent="center" gap={2} flexWrap="wrap">
          <Tabs.Trigger value="editProfile">
            <LuUser />
            <Text ml={2}>Edit Profile</Text>
          </Tabs.Trigger>
          <Tabs.Trigger value="watched">
            <LuFolder />
            <Text ml={2}>Watched</Text>
          </Tabs.Trigger>
          <Tabs.Trigger value="wtw">
            <LuCheckSquare />
            <Text ml={2}>WTW</Text>
          </Tabs.Trigger>
          <Tabs.Trigger value="followed">
            <LuUser />
            <Text ml={2}>Followed</Text>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="editProfile">
          <VStack align="start" mt={4}>
            <Heading size="sm">Edit Your Profile</Heading>
            <Text>
              Here, users can edit their profile information. ADD FORM HERE
            </Text>
          </VStack>
        </Tabs.Content>

        <Tabs.Content value="watched">
          <VStack align="start" mt={4}>
            <Heading size="sm">Movies You’ve Watched</Heading>
            <Box w="100%" h="100px" bg="gray.200" mt={2}></Box>
            <Box w="100%" h="100px" bg="gray.200" mt={2}></Box>
          </VStack>
        </Tabs.Content>

        <Tabs.Content value="wtw">
          <VStack align="start" mt={4}>
            <Heading size="sm">Movies You Want to Watch</Heading>
            <Box w="100%" h="100px" bg="gray.200" mt={2}></Box>
            <Box w="100%" h="100px" bg="gray.200" mt={2}></Box>
          </VStack>
        </Tabs.Content>

        <Tabs.Content value="followed">
          <VStack align="start" mt={4}>
            <Heading size="sm">People You Follow</Heading>
            <Box w="100%" h="50px" bg="gray.200" mt={2}></Box>
            <Box w="100%" h="50px" bg="gray.200" mt={2}></Box>
          </VStack>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
