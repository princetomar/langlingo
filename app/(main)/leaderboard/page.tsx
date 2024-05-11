import Promo from "@/components/promo";
import { FeedWrapper } from "@/components/shared/feed-wrapper";
import { StickyWrapper } from "@/components/shared/sticky-wrapper";
import { UserProgress } from "@/components/shared/user-progress";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  getTopTenUsers,
  getUserProgress,
  getUserSubscription,
} from "@/database/queries";
import Image from "next/image";
import { redirect } from "next/navigation";

type LeaderBoardPageProps = {};

const LeaderBoardPage = async ({}: LeaderBoardPageProps) => {
  // get user progress data from db/queries
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();
  // get top 10 users data
  const leaderboardData = getTopTenUsers();
  // structure the user progress
  const [userProgress, userSubscription, leaderboard] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    leaderboardData,
  ]);

  const isProUser = !!userSubscription?.isActive;

  if (!userProgress || !userProgress.activeCourse) {
    redirect("/courses");
  }
  return (
    <div className=" flex flex-row-reverse gap-[48px] px-6 ">
      <StickyWrapper>
        {!isProUser && <Promo />}
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isProUser}
        />
      </StickyWrapper>

      <FeedWrapper>
        <div className=" w-full flex flex-col items-center">
          <Image
            src={"/leaderboard.svg"}
            alt="Leaderboard"
            height={90}
            width={90}
          />
          <h1 className=" text-center font-bold text-2xl text-neutral-800">
            Leaderboardc
          </h1>
          <p className=" text-muted-foreground text-center text-lg mb-6">
            See where you stand among other learners in the community.
          </p>

          <Separator className=" mb-5 h-0.5 rounded-full" />
          {leaderboard.map((userProgress, index) => (
            <div
              id={userProgress.userId}
              className=" flex items-center w-full
             p-2 px-4 rounded-xl hover:bg-gray-200/50"
            >
              <p className=" font-bold text-lime-700 mr-4">{index + 1}</p>
              {/* showing the avatar */}
              <Avatar className="border bg-green-500 h-12 w-12 ml-3 mr-6">
                <AvatarImage
                  className="object-cover"
                  src={userProgress.userImageSrc}
                ></AvatarImage>
              </Avatar>
              <p className=" font-bold text-neutral-800 flex-1 ">
                {userProgress.userName}
              </p>
              <p className="text-muted-foreground"> {userProgress.points} XP</p>
            </div>
          ))}
        </div>
      </FeedWrapper>
    </div>
  );
};

export default LeaderBoardPage;
