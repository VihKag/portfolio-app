// Type definitions for Portfolio App
// These are exported as object schemas for JavaScript validation

export const PortfolioItemSchema = {
  id: String,
  user_id: String,
  type: String, // "image" | "project" | "blog" | "video"
  title: String,
  description: String,
  image_url: String,
  content_url: String,
  tags: Array,
  created_at: String,
}

export const UserProfileSchema = {
  id: String,
  username: String,
  email: String,
  display_name: String,
  bio: String,
  avatar_url: String,
  cover_image_url: String,
  created_at: String,
}

export const SocialLinkSchema = {
  id: String,
  user_id: String,
  platform: String, // "twitter" | "linkedin" | "github" | "instagram"
  url: String,
  created_at: String,
}

export const ContactMessageSchema = {
  id: String,
  user_id: String,
  sender_email: String,
  sender_name: String,
  message: String,
  read: Boolean,
  created_at: String,
}

export const ExperienceSchema = {
  id: String,
  user_id: String,
  title: String,
  company: String,
  location: String,
  start_date: String,
  end_date: String,
  description: String, // newline-separated bullet points
  sort_order: Number,
  created_at: String,
}

export const EducationSchema = {
  id: String,
  user_id: String,
  degree: String,
  school: String,
  location: String,
  start_date: String,
  end_date: String,
  details: String, // newline-separated bullet points
  sort_order: Number,
  created_at: String,
}

export const SkillSchema = {
  id: String,
  user_id: String,
  category: String,
  items: Array, // array of skill strings
  sort_order: Number,
  created_at: String,
}

export const CertificationSchema = {
  id: String,
  user_id: String,
  name: String,
  issuer: String,
  sort_order: Number,
  created_at: String,
}
