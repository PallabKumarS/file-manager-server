import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { status } from "http-status";
import { SubscriptionService } from "./subscription.service";

const createSubscription = catchAsync(async (req, res) => {
  const result = await SubscriptionService.createSubscription(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Subscription created successfully!",
    data: result,
  });
});

const getAllSubscriptions = catchAsync(async (_req, res) => {
  const result = await SubscriptionService.getAllSubscriptions();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Subscriptions retrieved successfully!",
    data: result,
  });
});

const getSingleSubscription = catchAsync(async (req, res) => {
  const result = await SubscriptionService.getSingleSubscription(
    req.params.id as string,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Subscription retrieved successfully!",
    data: result,
  });
});

const updateSubscription = catchAsync(async (req, res) => {
  const result = await SubscriptionService.updateSubscription(
    req.params.id as string,
    req.body,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Subscription updated successfully!",
    data: result,
  });
});

const deleteSubscription = catchAsync(async (req, res) => {
  const result = await SubscriptionService.deleteSubscription(
    req.params.id as string,
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Subscription deleted successfully!",
    data: result,
  });
});

export const SubscriptionController = {
  createSubscription,
  getAllSubscriptions,
  getSingleSubscription,
  updateSubscription,
  deleteSubscription,
};
