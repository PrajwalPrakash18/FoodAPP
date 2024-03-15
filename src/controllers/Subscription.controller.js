// subscription.controller.js
import Subscription from '../models/subscription.model.js';
import { ApiError } from '../utils/ApiError.js';

const createSubscription = async (req, res) => {
  try {
    const { userId, productId, duration, startDate } = req.body;

    // Validate input data
    if (!userId || !productId || !duration || !startDate) {
      throw new ApiError(400, 'Invalid input data');
    }

    // Calculate end date
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + duration);

    // Check for conflicts with existing subscriptions
    const existingSubscription = await Subscription.findOne({
      userId,
      productId,
      $or: [
        { startDate: { $lte: startDate }, endDate: { $gte: startDate } },
        { startDate: { $lte: endDate }, endDate: { $gte: endDate } },
      ],
    });

    if (existingSubscription) {
      throw new ApiError(400, 'Subscription conflicts with existing subscription');
    }

    // Create new subscription
    const subscription = new Subscription({
      userId,
      productId,
      duration,
      startDate,
      endDate,
    });

    await subscription.save();

    res.status(200).json({ success: true, message: 'Subscription created successfully' });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const getSubscriptions = async (req, res) => {
  try {
    const { userId } = req.params;

    const subscriptions = await Subscription.find({ userId });

    res.status(200).json({ success: true, subscriptions });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const updateSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;
    const { duration } = req.body;

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      throw new ApiError(404, 'Subscription not found');
    }

    subscription.duration = duration;
    await subscription.save();

    res.status(200).json({ success: true, message: 'Subscription updated successfully' });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findById(subscriptionId);

    if (!subscription) {
      throw new ApiError(404, 'Subscription not found');
    }

    await subscription.remove();

    res.status(200).json({ success: true, message: 'Subscription canceled successfully' });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

export { createSubscription, getSubscriptions, updateSubscription, cancelSubscription };
