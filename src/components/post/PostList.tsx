// 게시글 목록 컴포넌트

import { useEffect, useState, type ChangeEvent } from "react";
import type { Post } from "../../lib/post";
import { auth, db } from "../../lib/firebase";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from "firebase/firestore";

const PostList = () => {
  const [ posts, setPosts ] = useState<Post[]>([]);
  // 현재 수정 중인 게시글의 ID를 저장
  // 수정 중인 게시글이 없으면 null, 있으면 그 게시글의 Firestore - doc.id
  const [ editingId, setEditingId ] = useState<string | null> (null);
  // 수정 중인 게시글의 텍스트 내용을 임시로 저장
  const [ editingText, setEditingText ] = useState<string>("");
  // 수정 중인 게시글의 이미지를 임시로 저장
  const [ editingImage, setEditingImage ] = useState<string | null>(null);

  // const auth = getAuth(); -> 이렇게 호출하면 Fetch API cannot load (CORS) 오류 발생
  const user = auth.currentUser;

  useEffect(() => {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    // 실시간 Post 연동
    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const items: Post[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Post, "id">;
        return {
          id: doc.id,
          text: data.text,
          image: data.image || null,
          createdAt: data.createdAt,
          authorId: data.authorId,
          authorName: data.authorName
        };
      });
      setPosts(items);
    });
    return () => unsubscribe();
  }, []);

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
    if(!files) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingImage(reader.result as string);
    }
    reader.readAsDataURL(file);
  };

  return (
    <div>
      {
        posts.map((post) => (
          <div key={post.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            {
              // 현재 수정 중인 게시글
              editingId === post.id ? (
                <>
                  <textarea
                    value={editingText}
                    onChange={handleTextChange}
                    rows={4}
                    style={{ width: "100%", marginBottom: "8px" }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {
                    editingImage && (
                      <img
                        src={editingImage}
                        alt="preview"
                        style={{ maxWidth: "200px", marginTop: "8px" }}
                      />
                    )
                  }
                  <button onClick={() => handleEdit(post.id)}>Save</button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditingText("");
                      setEditingImage(null);
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p>{post.text}</p>
                  {
                    post.image && (
                      <img
                        src={post.image}
                        alt="post"
                        style={{ maxWidth: "200px" }}
                      />
                    )
                  }

                  { /* 본인 게시글만 수정/삭제 버튼 노출되도록 해야 함 */ }
                  {
                    user?.uid === post.authorId && (
                      <>
                        <button
                          onClick={() => {
                            setEditingId(post.id);
                            setEditingText(post.text);
                            setEditingImage(post.image || null);
                          }}
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDelete(post.id)}>Delete</button>
                      </>
                    )}
                </>
              )
            }
          </div>
        ))
      }
    </div>
  )
}

export default PostList;