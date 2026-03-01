import prisma from "@/lib/prisma";
import { AppError } from "../../errors/AppError";
import { status } from "http-status";
import type { SUBSCRIPTIONS } from "@prisma/client";

const createSubscription = async (payload: SUBSCRIPTIONS) => {
  return prisma.sUBSCRIPTIONS.create({ data: payload });
};

const getAllSubscriptions = async () => {
  return prisma.sUBSCRIPTIONS.findMany();
};

const getSingleSubscription = async (id: string) => {
  const result = await prisma.sUBSCRIPTIONS.findUnique({ where: { id } });
  if (!result) throw new AppError(status.NOT_FOUND, "Subscription not found");
  return result;
};

const updateSubscription = async (id: string, payload: SUBSCRIPTIONS) => {
  return prisma.sUBSCRIPTIONS.update({
    where: { id },
    data: payload,
  });
};

const deleteSubscription = async (id: string) => {
  return prisma.sUBSCRIPTIONS.delete({ where: { id } });
};

export const SubscriptionService = {
  createSubscription,
  getAllSubscriptions,
  getSingleSubscription,
  updateSubscription,
  deleteSubscription,
};
