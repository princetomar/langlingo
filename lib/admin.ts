import { auth } from "@clerk/nextjs";

const allowedIds = ["user_2dsStqx2PgxAmToYKahwyO7qtNW"];

export const getIsAdmin = async () => {
  const { userId } = await auth();
  if (!userId) {
    return false;
  }
  return allowedIds.indexOf(userId) !== -1;
};
