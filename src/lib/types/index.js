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
