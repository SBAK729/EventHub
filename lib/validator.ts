import * as z from "zod"

export const eventFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters').max(400, 'Description must be less than 400 characters'),
  imageUrl: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  categoryId: z.string(),
  isFree: z.boolean(),
  price: z.string().optional(), // optional if isFree
  locationType: z.enum(["physical", "online"]),
  location: z.string().optional(),
  url: z.string().url().optional(),
}).refine((data) => {
  // Require location for physical events
  if (data.locationType === "physical" && !data.location) return false;
  // Require url for online events
  if (data.locationType === "online" && !data.url) return false;
  // Require price if not free
  if (!data.isFree && !data.price) return false;
  return true;
}, {
  message: "Some required fields are missing or invalid based on event type",
  path: ["location"], // You can change this path to a general error
})
