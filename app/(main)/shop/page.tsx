import { FeedWrapper } from "@/components/shared/feed-wrapper";
import { StickyWrapper } from "@/components/shared/sticky-wrapper";
import { UserProgress } from "@/components/shared/user-progress";
import { getUserProgress, getUserSubscription } from "@/database/queries";
import Image from "next/image";
import { redirect } from "next/navigation";
import Items from "./items";
import Promo from "@/components/promo";

type ShopPageProps = {};

const ShopPage = async ({}: ShopPageProps) => {
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
          <Image src={"/shop.svg"} alt="Shop" height={90} width={90} />
          <h1 className=" text-center font-bold text-2xl text-neutral-800">
            Shop
          </h1>
          <p className=" text-muted-foreground text-center text-lg mb-6">
            Spend your points on cool stuff.
          </p>
        </div>
        <Items
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isProUser}
        />
      </FeedWrapper>
    </div>
  );
};

export default ShopPage;
