import { Box, Button, Heading, VStack, Text, Image } from "@chakra-ui/react";
import { Tabs } from "@chakra-ui/react";
import { LuUser, LuFolder, LuCheckSquare } from "react-icons/lu";
import EditProfile from "./EditProfile";
import { currentUser } from "@clerk/nextjs/server";
import { getUserIdByClerkId } from "@/utilities/getUserByClerkId";
import getUsernameById from "@/utilities/getUsernameById";
import { Film } from "@/utilities/getFilmById";
import connect from "@/utilities/connect";
import FilmGallery from "./FilmGallery";

type FilmListEntry = {
  user_id: number;
  film_id: number;
  created_at: Date;
};

export default async function UserProfile() {
  const myUser = await currentUser();
  const myUserId = myUser ? await getUserIdByClerkId(myUser!.id) : null;
  const username = myUserId ? await getUsernameById(myUserId) : null;
  const db = connect();

  async function getAllFilmsFromList(list: string): Promise<Film[]> {
    if (list === "wtw") {
      const result = await db.query<FilmListEntry & Film>(
        `SELECT * FROM wtw_films INNER JOIN films ON wtw_films.film_id = films.film_id WHERE user_id = $1`,
        [myUserId]
      );
      return result.rows;
    } else if (list === "watched") {
      const result = await db.query<FilmListEntry & Film>(
        `SELECT * FROM watched_films INNER JOIN films ON watched_films.film_id = films.film_id WHERE user_id = $1`,
        [myUserId]
      );
      return result.rows;
    } else {
      return [];
    }
  }

  return (
    <Box p={{ base: 4, md: 8 }}>
      {/* ---------- Profile Section ----------- */}
      <VStack mt={4} align="center">
        <Image
          src="https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
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

      {/* ----------------- Tabs Section ----------------- */}
      <Tabs.Root defaultValue="editProfile" colorScheme="teal" mt={8}>
        <Tabs.List justifyContent="center" gap={2} flexWrap="wrap">
          <Tabs.Trigger
            value="editProfile"
            _selected={{ bg: "teal.500", color: "white" }}
          >
            <LuUser />
            <Text ml={2}>Edit Profile</Text>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="watched"
            _selected={{ bg: "teal.500", color: "white" }}
          >
            <LuFolder />
            <Text ml={2}>Watched</Text>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="wtw"
            _selected={{ bg: "teal.500", color: "white" }}
          >
            <LuCheckSquare />
            <Text ml={2}>WTW</Text>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="followed"
            _selected={{ bg: "teal.500", color: "white" }}
          >
            <LuUser />
            <Text ml={2}>Followed</Text>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="editProfile">
          <VStack align="start">
            <Heading size="sm" mt={4}>
              Edit Your Profile
            </Heading>
            <Text mt={2}>Here, users can edit their profile information.</Text>
            <EditProfile />
          </VStack>
        </Tabs.Content>

        <Tabs.Content value="watched">
          <VStack align="start">
            <Heading size="sm" mt={4}>
              Movies You&apos;ve Watched
            </Heading>
            <FilmGallery
              filmList={await getAllFilmsFromList("watched")}
            ></FilmGallery>
          </VStack>
        </Tabs.Content>

        <Tabs.Content value="wtw">
          <VStack align="start">
            <Heading size="sm" mt={4}>
              Movies You Want to Watch
            </Heading>
            <FilmGallery
              filmList={await getAllFilmsFromList("wtw")}
            ></FilmGallery>
          </VStack>
        </Tabs.Content>

        <Tabs.Content value="followed">
          <VStack align="start">
            <Heading size="sm" mt={4}>
              People You Follow
            </Heading>
            <Box w="100%" h="50px" bg="gray.200" mt={2}></Box>
            <Box w="100%" h="50px" bg="gray.200" mt={2}></Box>
          </VStack>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
