import connect from "@/utilities/connect";
import ActivityComponent from "@/components/ActivityComponent";
import { Box, VStack, Flex, Heading } from "@chakra-ui/react";
import { getUserIdByClerkId } from "@/utilities/getUserByClerkId";
import { currentUser } from "@clerk/nextjs/server";

export type Activity = {
  activity_id: number;
  user_id: number;
  film_id: number;
  activity_body?: string;
  activity_type: "watch" | "wtw" | "watch_from_wtw";
  created_at: Date;
};

export default async function Feed({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  async function getActivities(): Promise<Activity[]> {
    const db = connect();
    const result = await db.query<Activity>(
      `SELECT * FROM activities ORDER BY created_at DESC`
    );
    return result.rows;
  }

  async function getFollowedActivities(): Promise<Activity[]> {
    const db = connect();

    const myUser = await currentUser();
    let myUserId;
    if (myUser) {
      myUserId = await getUserIdByClerkId(myUser!.id);
    }

    const result = await db.query<Activity>(
      `SELECT activity_id, user_id, film_id, activity_body, activity_type, activities.created_at FROM follows INNER JOIN activities ON followed_id = user_id WHERE follower_id = $1;`,
      [myUserId]
    );
    return result.rows;
  }

  const showFollowingOnly =
    (await searchParams).following === "true" ? true : false;

  function ActivityBox({ activity }: { activity: Activity }) {
    return (
      <Box
        p={6}
        bg="rgba(50, 50, 50, 0.85)"
        borderRadius="2xl"
        border="1px solid rgba(255, 255, 255, 0.2)"
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.2)"
        backdropFilter="blur(8px)" // Applies blur effect
        w="100%"
        maxW="80vw"
      >
        <ActivityComponent activity={activity} />
      </Box>
    );
  }

  return (
    <Flex
      minH="100vh"
      justify="center"
      align="center"
      px={4}
      background="radial-gradient(125% 125% at 50% 10%, #444 40%, #63e 100%)"
      overflowY="auto"
      w="full"
    >
      <VStack w="90%" maxW="900px" py={8} gap={6}>
        <Heading size="lg" color="whiteAlpha.900" mb={4}>
          {showFollowingOnly
            ? "Activities from people you follow"
            : "Activities"}
        </Heading>
        {showFollowingOnly
          ? (await getFollowedActivities()).map((element) => (
              <ActivityBox
                key={element.activity_id}
                activity={element}
              ></ActivityBox>
            ))
          : (await getActivities()).map((element) => (
              <ActivityBox
                key={element.activity_id}
                activity={element}
              ></ActivityBox>
            ))}
      </VStack>
    </Flex>
  );
}
