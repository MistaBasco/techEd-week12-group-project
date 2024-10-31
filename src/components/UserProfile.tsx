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
import { notFound } from "next/navigation";

// data from watched_list and wtw_list
type FilmListEntry = {
  user_id: number;
  film_id: number;
  created_at: Date;
};

export default async function UserProfile({ user_id }: { user_id: number }) {
  const myUser = await currentUser();
  const myUserId = myUser ? await getUserIdByClerkId(myUser!.id) : null;
  let userOwnsThisProfile = false;
  if (myUserId === user_id) {
    userOwnsThisProfile = true;
  }

  let username: string;
  // check if the user_id corresponds to a real user, else boot us out to not-found page
  try {
    username = await getUsernameById(user_id);
  } catch (error) {
    console.log(error);
    notFound();
  }

  const db = connect();

  async function getAllFilmsFromList(list: string): Promise<Film[]> {
    if (list === "wtw") {
      const result = await db.query<FilmListEntry & Film>(
        `SELECT * FROM wtw_films INNER JOIN films ON wtw_films.film_id = films.film_id WHERE user_id = $1`,
        [user_id]
      );
      return result.rows;
    } else if (list === "watched") {
      const result = await db.query<FilmListEntry & Film>(
        `SELECT * FROM watched_films INNER JOIN films ON watched_films.film_id = films.film_id WHERE user_id = $1`,
        [user_id]
      );
      return result.rows;
    } else {
      return [];
    }
  }

  async function getProfilePic(user_id: number): Promise<string> {
    const result = await db.query(
      `SELECT profile_image_url FROM users WHERE user_id = $1`,
      [user_id]
    );
    if (result.rows[0].profile_image_url) {
      return result.rows[0].profile_image_url;
    } else {
      return "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=";
    }
  }

  return (
    <Box p={{ base: 4, md: 8 }}>
      {/* ---------- Profile Section ----------- */}
      <VStack mt={4} align="center">
        <Image
          src={await getProfilePic(user_id)}
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
      <Tabs.Root
        defaultValue={userOwnsThisProfile ? "editProfile" : "watched"}
        colorScheme="teal"
        mt={8}
      >
        <Tabs.List justifyContent="center" gap={2} flexWrap="wrap">
          {userOwnsThisProfile && (
            <Tabs.Trigger
              value="editProfile"
              className="p-2"
              _selected={{ bg: "teal.500", color: "white" }}
            >
              <LuUser />
              <Text ml={1}>Edit Profile</Text>
            </Tabs.Trigger>
          )}
          <Tabs.Trigger
            value="watched"
            className="p-2"
            _selected={{ bg: "teal.500", color: "white" }}
          >
            <LuFolder />
            <Text ml={1}>Watched</Text>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="wtw"
            className="p-2"
            _selected={{ bg: "teal.500", color: "white" }}
          >
            <LuCheckSquare />
            <Text ml={1}>WTW</Text>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="followed"
            className="p-2"
            _selected={{ bg: "teal.500", color: "white" }}
          >
            <LuUser />
            <Text ml={1}>Followed</Text>
          </Tabs.Trigger>
        </Tabs.List>

        {/* edit tab only shows up if it's your profile */}
        {userOwnsThisProfile && (
          <Tabs.Content value="editProfile">
            <VStack align="start">
              <Heading size="sm" mt={4}>
                Edit Your Profile
              </Heading>
              <Text mt={2}>
                Here, users can edit their profile information.
              </Text>
              <EditProfile />
            </VStack>
          </Tabs.Content>
        )}

        <Tabs.Content value="watched">
          <VStack align="start">
            <Heading size="sm" mt={4}>
              Films {userOwnsThisProfile ? "you've" : `${username} has`} watched
            </Heading>
            <FilmGallery
              filmList={await getAllFilmsFromList("watched")}
            ></FilmGallery>
          </VStack>
        </Tabs.Content>

        <Tabs.Content value="wtw">
          <VStack align="start">
            <Heading size="sm" mt={4}>
              Films {userOwnsThisProfile ? "you want" : `${username} wants`} to
              watch
            </Heading>
            <FilmGallery
              filmList={await getAllFilmsFromList("wtw")}
            ></FilmGallery>
          </VStack>
        </Tabs.Content>

        <Tabs.Content value="followed">
          <VStack align="start">
            <Heading size="sm" mt={4}>
              People{" "}
              {userOwnsThisProfile ? "you follow" : `${username} follows`}
            </Heading>
            <Box w="100%" h="50px" bg="gray.200" mt={2}></Box>
            <Box w="100%" h="50px" bg="gray.200" mt={2}></Box>
          </VStack>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
}
