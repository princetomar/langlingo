"use client";
import { useRouter } from "next/navigation";
import { courses, userProgress } from "@/database/schema";
import { CourseCard } from "./course-card";
import { useTransition } from "react";
import { upsertUserProgres } from "@/actions/user-progress";
import { toast } from "sonner";

type CoursesListProps = {
  courses: (typeof courses.$inferSelect)[];
  activeCourseId?: typeof userProgress.$inferSelect.activeCourseId;
};

export const List = ({ courses, activeCourseId }: CoursesListProps) => {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const onClick = (id: number) => {
    if (pending) return;
    if (id === activeCourseId) {
      return router.push("/learn");
    }

    startTransition(() => {
      upsertUserProgres(id).catch(() => toast.error("Something went wrong!"));
    });
  };
  return (
    <div className=" pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4">
      {/* map over the courses and show it */}
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          onClick={onClick}
          disabled={pending}
          active={course.id === activeCourseId}
        />
      ))}
    </div>
  );
};
