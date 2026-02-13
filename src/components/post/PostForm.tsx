// 게시글 작성 컴포넌트
import { useState, type ChangeEvent, type FormEvent } from "react";
// Firebase Storage 유료화로 인해 Storage 제거
import { auth, db } from "../../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const PostForm = () => {
  const [ text, setText ] = useState<string>("");
  const [ image, setImage ] = useState<string | null>(null);
  const [ loading, setLoading ] = useState<boolean>(false);

  const user = auth.currentUser;

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // 이미지 선택 시 Base64로 변환하여 image에 저장
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    }
    reader.readAsDataURL(file);
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await addDoc(collection(db, "posts"), {
        text,
        image,
        createdAt: serverTimestamp(),
        authorId: user.uid,
        authorName: user.displayName || user.email
      });

      setText("");
      setImage(null);
    } catch (error) {
      console.error("Error occured while posting: ", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Express yourself"
        rows={4}
        style={{ width: "100%", marginBottom: "8px" }}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      {
        image && (
          <img
            src={image}
            alt="preview"
            style={{ maxWidth: "200px", marginTop: "8px" }}
          />
        )
      }
      <button type="submit" disabled={ loading } style={{ marginTop: "8px" }}>
        {loading ? "Posting..." : "Post"}
      </button>
    </form>
  )
}

export default PostForm;