import { Box, Heading, VStack, Text, Image, Flex } from "@chakra-ui/react";
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
import FollowList from "./FollowList";

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
    return (
      result.rows[0].profile_image_url ||
      "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0="
    );
  }

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgRepeat="no-repeat"
      bgSize="cover"
      px={4}
      className="sticky inset-0 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] overflow-y-auto w-full"
    >
      <Box
        p={{ base: 4, md: 8 }}
        bg="rgba(255, 255, 255, 0.1)"
        borderRadius="2xl"
        boxShadow="lg"
        border="1px solid rgba(255, 255, 255, 0.3)"
        position="relative"
        minH="600px"
        width="80vw"
        maxW="80vw"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          bg: "inherit",
          backdropFilter: "blur(10px)",
          borderRadius: "2xl",
        }}
      >
        <VStack mt={4} align="center">
          <Flex
            mt={4}
            align="center"
            justify="center"
            direction="column"
            position="relative"
            zIndex="1"
          >
            <Image
              src={await getProfilePic(user_id)}
              alt="User Profile Picture"
              boxSize={{ base: "80px", md: "100px" }}
              borderRadius="full"
              bg="gray.300"
              border="2px solid rgba(255, 255, 255, 0.4)"
              boxShadow="0px 4px 20px rgba(0, 0, 0, 0.2)"
            />
            <Heading
              size={{ base: "md", md: "lg" }}
              mt={4}
              color="whiteAlpha.900"
            >
              {username}
            </Heading>
          </Flex>

          <Heading
            size={{ base: "md", md: "lg" }}
            mt={4}
            color="whiteAlpha.900"
          >
            {username}
          </Heading>
        </VStack>

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
                _selected={{ color: "white" }}
              >
                <LuUser />
                <Text ml={1}>Edit Profile</Text>
              </Tabs.Trigger>
            )}
            <Tabs.Trigger
              value="watched"
              className="p-2"
              _selected={{ color: "white" }}
            >
              <LuFolder />
              <Text ml={1}>Watched</Text>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="wtw"
              className="p-2"
              _selected={{ color: "white" }}
            >
              <LuCheckSquare />
              <Text ml={1}>WTW</Text>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="followed"
              className="p-2"
              _selected={{ color: "white" }}
            >
              <LuUser />
              <Text ml={1}>Followed</Text>
            </Tabs.Trigger>
          </Tabs.List>

          <Box mt={4} p={4}>
            {userOwnsThisProfile && (
              <Tabs.Content value="editProfile">
                <VStack align="start">
                  <Heading size="sm" color="whiteAlpha.900">
                    Edit Your Profile
                  </Heading>
                  <Text mt={2} color="whiteAlpha.800">
                    Here, users can edit their profile information.
                  </Text>
                  <EditProfile />
                </VStack>
              </Tabs.Content>
            )}

            <Tabs.Content value="watched">
              <VStack align="start">
                <Heading size="sm" color="whiteAlpha.900">
                  Films {userOwnsThisProfile ? "you've" : `${username} has`}{" "}
                  watched
                </Heading>
                <FilmGallery
                  filmList={await getAllFilmsFromList("watched")}
                ></FilmGallery>
              </VStack>
            </Tabs.Content>

            <Tabs.Content value="wtw">
              <VStack align="start">
                <Heading size="sm" color="whiteAlpha.900">
                  Films {userOwnsThisProfile ? "you want" : `${username} wants`}{" "}
                  to watch
                </Heading>
                <FilmGallery
                  filmList={await getAllFilmsFromList("wtw")}
                ></FilmGallery>
              </VStack>
            </Tabs.Content>

            <Tabs.Content value="followed">
              <VStack align="start">
                <Heading size="sm" color="whiteAlpha.900">
                  People{" "}
                  {userOwnsThisProfile ? "you follow" : `${username} follows`}
                </Heading>
                <FollowList user_id={user_id} />
              </VStack>
            </Tabs.Content>
          </Box>
        </Tabs.Root>
      </Box>
    </Flex>
  );
}
