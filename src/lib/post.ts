// 게시글 타입 정의

export interface Post {
  id: string;
  text: string;
  image?: string | null;
  createdAt: any;
  authorId: string;
  authorName: string
}