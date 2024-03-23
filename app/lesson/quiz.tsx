"use client";

import { challengeOptions, challenges } from "@/database/schema";
import { useState } from "react";
import Header from "./header";

type QuizProps = {
  initialLessonId: number;
  initialHearts: number;
  initialPercentage: number;
  userSubscription: any;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
};

const Quiz = ({
  initialLessonId,
  initialHearts,
  initialPercentage,
  userSubscription,
  initialLessonChallenges,
}: QuizProps) => {
  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(initialPercentage);

  return (
    <>
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className=" flex-1">
        <div className=" h-full flex items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className=" text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700 ">
              Which of these is an apple?
            </h1>
            {/* Rendering our challenge component */}
            <div></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Quiz;
