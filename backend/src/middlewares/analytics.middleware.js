import { Analytics } from "../models/analytics.model.js";

const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const trackVisitMiddleware = async (req, res, next) => {
  try {
    const today = getStartOfToday();
    Analytics.findOneAndUpdate(
      { date: today },
      {
        $inc: { totalVisits: 1 },
        $setOnInsert: { date: today },
      },
      { upsert: true }
    ).exec(); 
    next(); 
    
  } catch (error) {
    // If tracking fails, we don't want the whole site to fail.
    // Just log it and move on.
    console.error("Analytics tracking failed:", error);
    next(); // Always call next()
  }
};