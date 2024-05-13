import { NextResponse } from "next/server";
import db from "@/database/drizzle";
import { courses } from "@/database/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async () => {
  const isAdminUser = getIsAdmin();

  if (!isAdminUser) {
    return new NextResponse("Unauthorized", {
      status: 403,
    });
  }

  const data = await db.query.courses.findMany();

  return NextResponse.json(data);
};

export const POST = async (req: Request) => {
  const isAdminUser = getIsAdmin();

  if (!isAdminUser) {
    return new NextResponse("Unauthorized", {
      status: 403,
    });
  }

  const body = await req.json();
  const data = await db
    .insert(courses)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
};
