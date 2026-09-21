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
  created_at: string;
  updated_at: string;
};

export type GgmPostWithAuthor = GgmPost & {
  ggm_profiles: { nickname: string } | null;
};
