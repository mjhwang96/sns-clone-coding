// 게시글 타입 정의

import type { Timestamp } from "firebase/firestore";

export interface Post {
  id: string;
  text: string;
  image?: string | null;
  createdAt: Timestamp;
  authorId: string;
  authorName: string;
  authorPhoto: string;
}