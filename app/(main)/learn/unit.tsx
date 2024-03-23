// unit.tsx

import { units, lessons } from "@/database/schema";
import { UnitBanner } from "./unit-banner";
import { LessonButton } from "./lesson-button";

type Props = {
  id: number | string;
  order: number;
  title: string;
  description: string;
  lessons: (typeof lessons.$inferSelect & {
    completed: boolean;
  })[];
  activeLesson:
    | (typeof lessons.$inferSelect & {
        unit: typeof units.$inferSelect;
      })
    | undefined;
  activeLessonPercentage: number;
};

export const Unit = ({
  id,
  order,
  description,
  title,
  lessons,
  activeLesson,
  activeLessonPercentage,
}: Props) => {
  return (
    <>
      <UnitBanner title={title} description={description} />
      <div className=" flex items-center flex-col relative">
        {lessons.map((lesson, index) => {
          const isCurrentLesson = lesson.id === activeLesson?.id;
          const isLessonLocked = !lesson.completed && !isCurrentLesson;
          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={index}
              totalCount={lessons.length - 1}
              current={isCurrentLesson}
              locked={isLessonLocked}
              percentage={activeLessonPercentage}
            />
          );
        })}
      </div>
    </>
  );
};
