// 게시글 목록 컴포넌트
import { useEffect, useState, type ChangeEvent } from "react";
import type { Post } from "../../lib/post";
import { auth, db } from "../../lib/firebase";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, Timestamp, updateDoc, where } from "firebase/firestore";
import styled from "styled-components";
import defaultAvatar from "../../assets/images/default-avatar.png";

type PostListProps = {
  userId?: string;
}

const PostDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  padding: 20px;
  margin: 10px;
  border-radius: 20px;
  border: 1px solid #ccc;

  background: #ffffff;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d0ebff;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  }
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between; // 양끝 정렬
  align-items: center;
  gap: 12px;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Avatar = styled.img `
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
`;

const Name = styled.span`
  font-size: 14px;
  font-weight: 600;
  overflow: hidden; // 넘치는 부분 숨김 처리
  text-overflow: ellipsis; // ... 표시
  white-space: nowrap; // 줄바꿈 금지
`;

const Date = styled.span`
  font-size: 12px;
  opacity: 0.6;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  font-size: 15px;
  resize: none;
  outline: none; // 기본 포커스 테두리 제거
  transition: all 0.2s ease;

  &:focus {
    border-color: #b2cee1;
    box-shadow: 0 0 0 3px rgba(29, 155, 240, 0.15);
  }
`;

const FileLabel = styled.label`
  display: inline-block;
  padding: 8px 14px;
  background: #f3f4f6;
  font-size: 11px;
  cursor: pointer;
  width: fit-content;
`;

const HiddenInput = styled.input`
  display: none;
`;

const Image = styled.img`
  max-width: 220px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const Text = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #333;

  // 긴 단어 / 긴 URL이 박스를 넘지 않도록 강제로 줄바꿈
  word-break: break-word;
  // 사용자가 입력한 줄바꿈을 그대로 유지
  white-space: pre-wrap;
`;

const ButtonGroup = styled.div`
  align-self: flex-end;
  display: flex;
  gap: 8px;
  margin-top: 8px;
`;

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button = styled.button<ButtonProps>`
  padding: 8px 14px;
  border-radius: 20px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant }) => {
    switch(variant) {
      case 'primary':
        return `
          background-color: #8fc1e3;
          color: white;
          font-weight: 500;
          font-size: 12px;

          &:hover {
            background-color: #6bb2e1;
          }

          // 버튼 누르는 순간에 크기가 3% 줄어드는 효과
          &:active {
            transform: scale(0.97);
          }
        `;
      case 'secondary':
        return `
          border: 1px solid #ccc;
          background-color: white;
          color: #555;
          font-weight: 500;
          font-size: 12px;

          &:hover {
            background-color: #f5f5f5;
          }

          &:active {
            transform: scale(0.97);
          }
        `;
      case 'danger':
        return `
          background-color: #ecb1b1;
          color: white;
          font-weight: 500;
          font-size: 12px;

          &:hover {
            background-color: #d88181;
          }

          &:active {
            transform: scale(0.97);
          }
        `;
      default:
        return ``;
    }
  }}
`;

/*
 * 1분 미만: 방금 전
 * 1시간 미만: n분 전
 * 24시간 미만: n시간 전
 * 7일 미만: n일 전
 * 7일 이상: YYYY.MM.DD
 */
const formatCreatedAt = (createdAt: Timestamp | Date | null) => {
  const now = new globalThis.Date();

  const postDate =  createdAt instanceof Timestamp
    ? createdAt.toDate()
    : createdAt;

  if (!postDate) return "";
  
  const diff = now.getTime() - postDate.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "방금 전";
  else if (minutes < 60) return `${minutes}분 전`;
  else if (hours < 24) return `${hours}시간 전`;
  else if (days < 7) return `${days}일 전`;

  return `${postDate.getFullYear()}
    .${String(postDate.getMonth() + 1).padStart(2, "0")}
    .${String(postDate.getDate()).padStart(2, "0")};
  )}`;
}

const PostList = ({userId}: PostListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  // 현재 수정 중인 게시글의 ID를 저장
  // 수정 중인 게시글이 없으면 null, 있으면 그 게시글의 Firestore - doc.id
  const [editingId, setEditingId] = useState<string | null> (null);
  // 수정 중인 게시글의 텍스트 내용을 임시로 저장
  const [editingText, setEditingText] = useState<string>("");
  // 수정 중인 게시글의 이미지를 임시로 저장
  const [editingImage, setEditingImage] = useState<string | null>(null);

  // const auth = getAuth(); -> 이렇게 호출하면 Fetch API cannot load (CORS) 오류 발생
  const user = auth.currentUser;

  useEffect(() => {
    let postsQuery;

    // userId 존재 (Profile.tsx)
    if (userId) {
      postsQuery = query(
        collection(db, "posts"),
        where("authorId", "==", userId),
        orderBy("createdAt", "desc")
      );
    } else {
      postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
      );
    }

    // 실시간 Post 연동
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...(doc.data() as Omit<Post, "id">)
        };
      });
      setPosts(data);
    });
    return () => unsubscribe();
  }, [userId]);

  // 게시글 삭제
  const handleDelete = async (id: string) => {
    if (window.confirm("Delete for sure?")) {
      await deleteDoc(doc(db, "posts", id));
    }
  };

  // 게시글 수정
  const handleEdit = async (id: string) => {
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, { text: editingText, image: editingImage });

    setEditingId(null);
    setEditingText("");
    setEditingImage(null);
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setEditingText(e.target.value);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return;

    const file = files[0];
    const reader = new FileReader();
    // 파일 읽기 작업이 끝나면 실행하는 함수 등록
    reader.onloadend = () => {
      setEditingImage(reader.result as string);
    }
    // 파일 읽기 작업 실행
    reader.readAsDataURL(file);
  };

  return (
    <PostDiv>
      {posts.map((post) => (
        <Container key={post.id}>
          {/* 현재 수정 중인 게시글 */}
          {editingId === post.id ? (
            <>
              <TextArea
                value={editingText}
                onChange={handleTextChange}
                rows={4}
              />

              <FileLabel htmlFor="file">
                📷 Add Image
              </FileLabel>
              <HiddenInput
                id="file"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {editingImage && (
                <Image
                  src={editingImage}
                  alt="Preview"
                />
              )}

              <ButtonGroup>
                <Button
                  variant="primary"
                  onClick={() => handleEdit(post.id)}
                >Save</Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setEditingText("");
                    setEditingImage(null);
                  }}
                >Cancel</Button>
              </ButtonGroup>
            </>
          ) : (
            <>
              {/* 게시물 헤더 */}
              <PostHeader>
                <AuthorInfo>
                  <Avatar
                    src={post.authorPhoto || defaultAvatar}
                    alt="Profile Avatar"
                  />
                  <Name>{post.authorName}</Name>
                </AuthorInfo>
                <Date>
                  {post.createdAt && formatCreatedAt(post.createdAt)}
                </Date>
              </PostHeader>

              <Text>{post.text}</Text>
              {post.image && (
                <Image
                  src={post.image}
                  alt="Post"
                />
              )}

              { /* 본인 게시글만 수정/삭제 버튼 노출되도록 해야 함 */ }
              {user?.uid === post.authorId && (
                <ButtonGroup>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setEditingId(post.id);
                      setEditingText(post.text);
                      setEditingImage(post.image || null);
                    }}
                  >Edit</Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(post.id)}
                  >Delete</Button>
                </ButtonGroup>
              )}
            </>
          )}
        </Container>
      ))}
    </PostDiv>
  )
}

export default PostList;