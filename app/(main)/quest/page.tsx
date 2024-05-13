import Promo from "@/components/ui/promo";
import { FeedWrapper } from "@/components/shared/feed-wrapper";
import { StickyWrapper } from "@/components/shared/sticky-wrapper";
import { UserProgress } from "@/components/shared/user-progress";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getUserProgress, getUserSubscription } from "@/database/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import { quests } from "@/constants";

type QuestsPageProps = {};

const QuestsPage = async ({}: QuestsPageProps) => {
  // get user progress data from db/queries
  const userProgressData = getUserProgress();
  const userSubscriptionData = getUserSubscription();

  // structure the user progress
  const [userProgress, userSubscription] = await Promise.all([
    userProgressData,
    userSubscriptionData,
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
          <Image src={"/quests.svg"} alt="Quests" height={90} width={90} />
          <h1 className=" text-center font-bold text-2xl text-neutral-800">
            Quests
          </h1>
          <p className=" text-muted-foreground text-center text-lg mb-6">
            Complete quests by earning points.
          </p>

          <ul className=" w-full">
            {quests.map((quest) => {
              const progress = (userProgress.points / quest.value) * 100;

              console.log({ progress, value: quest.value });

              return (
                <div
                  key={quest.title}
                  className=" flex items-center w-full p-4 gap-x-4 border-t-2"
                >
                  {quest.title}
                  <Image
                    src="/points.svg"
                    alt="Points"
                    width={60}
                    height={60}
                  />

                  <div className=" flex flex-col gap-y-2 w-full">
                    <p className="text-neutral-700  text-xl font-bold">
                      {" "}
                      {quest.title}
                    </p>
                    <Progress value={progress} className=" h-3" />
                  </div>
                </div>
              );
            })}
          </ul>
        </div>
      </FeedWrapper>
    </div>
  );
};

export default QuestsPage;
