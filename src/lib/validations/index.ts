import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const basicInfoSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  phone: z.string().min(10, "Valid phone number required").max(15),
  city: z.string().min(2, "City is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const artistProfileSchema = z.object({
  primaryRole: z.string().min(1, "Primary role is required"),
  secondaryRoles: z.array(z.string()).optional(),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  bio: z.string().min(50, "Bio should be at least 50 characters"),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  showreelUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
});

export const schoolProfileSchema = z.object({
  schoolName: z.string().min(2, "School name is required"),
  type: z.string().min(1, "Type is required"),
  city: z.string().min(2, "City is required"),
  coursesOffered: z.array(z.string()).min(1, "Add at least one course"),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  description: z.string().min(50, "Description should be at least 50 characters"),
});

export const productionProfileSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  type: z.string().min(1, "Type is required"),
  city: z.string().min(2, "City is required"),
  activeProjects: z.number().min(0),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  description: z.string().min(50, "Description should be at least 50 characters"),
});

export const clientProfileSchema = z.object({
  organizationName: z.string().min(2, "Organization/Name is required"),
  eventTypes: z.array(z.string()).min(1, "Select at least one event type"),
  city: z.string().min(2, "City is required"),
});

export const postRequirementSchema = z.object({
  roleNeeded: z.string().min(1, "Role is required"),
  subject: z.string().min(2, "Subject/Discipline is required"),
  duration: z.enum(["Short-term", "Long-term", "Project-based"]),
  budgetMin: z.coerce.number().min(0, "Minimum budget must be positive"),
  budgetMax: z.coerce.number().min(1, "Maximum budget must be greater than 0"),
  city: z.string().min(2, "City is required"),
  startDate: z.date({
    error: "Start date is required",
  }),
  description: z.string().min(20, "Please provide a detailed description"),
  requirements: z.array(z.string()).min(1, "Add at least one requirement"),
}).refine(data => data.budgetMax >= data.budgetMin, {
  message: "Maximum budget cannot be less than minimum budget",
  path: ["budgetMax"],
});

export const bookArtistSchema = z.object({
  eventType: z.string().min(1, "Event type is required"),
  eventDate: z.string().min(1, "Event date is required"),
  eventCity: z.string().min(2, "City is required"),
  durationHours: z.coerce.number().min(1, "Duration must be at least 1 hour"),
  additionalNotes: z.string(),
});
