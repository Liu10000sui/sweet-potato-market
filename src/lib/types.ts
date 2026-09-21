export type GgmProfile = {
  id: string;
  nickname: string;
  avatar_url: string | null;
  location: string | null;
  created_at: string;
};

export type GgmPostStatus = "selling" | "reserved" | "sold";

export type GgmPost = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  status: GgmPostStatus;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type GgmPostWithAuthor = GgmPost & {
  ggm_profiles: { nickname: string } | null;
  ggm_post_likes: { count: number }[];
};

export type GgmComment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  ggm_profiles: { nickname: string } | null;
};
