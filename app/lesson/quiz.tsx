"use client";

import { challengeOptions, challenges } from "@/database/schema";
import { useState, useTransition } from "react";

import Header from "./header";
import QuestionBubble from "./question-bubble";
import Challange from "./challange";
import Confetti from "react-confetti";
import Footer from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner";
import { reduceHearts } from "@/actions/user-progress";
import { useAudio, useWindowSize, useMount } from "react-use";
import Image from "next/image";
import ResultCard from "./result-card";
import { useRouter } from "next/navigation";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePractiseModal } from "@/store/use-practise-modal";

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
  // FOR GETTING MORE HEARTS
  const { open: openHeartsModal } = useHeartsModal();
  const { open: openPractiseModal } = usePractiseModal();

  //

  useMount(() => {
    if (initialPercentage === 100) {
      openPractiseModal();
    }
  });

  const { width, height } = useWindowSize();
  const router = useRouter();
  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });
  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });
  const [inCorrectAudio, _i, inCorrectControls] = useAudio({
    src: "/incorrect.wav",
  });
  const [pending, startTransition] = useTransition();

  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() => {
    return initialPercentage === 100 ? 0 : initialPercentage;
  });
  const [lessonId] = useState(initialLessonId);

  const [challenges] = useState(initialLessonChallenges);

  //  get the current challenge
  const [activeChallengeIndex, setActiveChallengeIndex] = useState(() => {
    const unCompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );

    return unCompletedIndex === -1 ? 0 : unCompletedIndex;
  });

  const [selectedOption, setSelectedOption] = useState<number>();
  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

  const currentChallenge = challenges[activeChallengeIndex];
  // get the current challange options
  const currentChallengeOptions = currentChallenge?.challengeOptions ?? [];

  const onNext = () => {
    // move to next challenge
    setActiveChallengeIndex((current) => current + 1);
  };

  const onSelect = (id: number) => {
    //  if user hasn't submitted their choice
    if (status !== "none") return;

    // if status is wrong/incorrect -> user can click on retry | next
    setSelectedOption(id);
  };

  const onContinue = () => {
    if (!selectedOption) return;

    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }
    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    //  find the correct option from the array of current challenge options
    const correctOption = currentChallengeOptions.find(
      (option) => option.correct
    );
    if (!correctOption) {
      return;
    }
    if (correctOption && correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(currentChallenge.id)
          .then((response) => {
            if (response?.error == "hearts") {
              openHeartsModal();
              console.log("Missing hearts");
              return;
            }

            correctControls.play();

            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);

            if (initialPercentage === 100) {
              // All challenges have already been completed
              setHearts((prev) => Math.min(prev + 1, 5));
            }
          })
          .catch(() => toast.error("Something went wrong.\nPlease try again."));
      });
    } else {
      startTransition(() => {
        reduceHearts(currentChallenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              openHeartsModal();
              console.error("Missing Hearts !");
              return;
            }
            inCorrectControls.play();
            setStatus("wrong");

            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch(() => toast.error("Something went wrong. Please try again !"));
      });
    }
  };

  // To not navigate the user after they reached the last challenge
  if (!currentChallenge) {
    return (
      <>
        {finishAudio}
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
        />
        <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
          <Image
            src={"/finish.svg"}
            alt="Finish"
            className=" hidden lg:block"
            height={100}
            width={100}
          />
          <h1 className=" text-xl lg:text-3xl font-bold text-neutral-700">
            Great job!, <br /> You've completed the lesson.
          </h1>
          <div className=" flex items-center gap-x-4 w-full">
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard variant="hearts" value={hearts} />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn ")}
        />
      </>
    );
  }

  const challengetitle =
    currentChallenge.type === "ASSIST"
      ? "Select the correct meaning"
      : currentChallenge.question;

  return (
    <>
      {inCorrectAudio}
      {correctAudio}
      <Header
        hearts={hearts}
        percentage={percentage}
        hasActiveSubscription={!!userSubscription?.isActive}
      />
      <div className="flex-1">
        <div className="h-full flex items-center justify-center">
          <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
            <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
              {challengetitle}
            </h1>
            {/* Rendering our challenge component */}
            <div>
              {currentChallenge.type === "ASSIST" && (
                <QuestionBubble question={currentChallenge.question} />
              )}
              <Challange
                options={currentChallengeOptions}
                onSelect={onSelect}
                status={status}
                selectedOption={selectedOption}
                disabled={pending}
                type={currentChallenge.type}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer
        disabled={pending || !selectedOption}
        status={status}
        onCheck={onContinue}
      />
    </>
  );
};

export default Quiz;
