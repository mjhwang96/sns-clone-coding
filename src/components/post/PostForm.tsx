// 게시글 작성 컴포넌트
import { useEffect, useState, type ChangeEvent } from "react";
// Firebase Storage 유료화로 인해 Storage 제거
import { auth, db } from "../../lib/firebase";
import styled from "styled-components";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const Container = styled.div`
  padding: 16px;
  background: #ffffffa0;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
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
  // 한 줄에 나란히 배치하면서도(inline) 크기 값 지정 가능(block)
  display: inline-block;
  padding: 8px 14px;
  background: ${({ theme }) => theme.buttonColor};
  color: ${({ theme }) => theme.textColor};
  font-size: 11px;
  cursor: pointer;
  width: fit-content;
`;

const HiddenInput = styled.input`
  display: none;
`;

const PreviewImage = styled.img`
  max-width: 220px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`;

const SubmitButton = styled.button`
  align-self: flex-end;
  padding: 10px 18px;
  border-radius: 999px;
  border: none;
  background-color: #387cab7d;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #9a97cc;
  }

  &:disabled {
    background-color: #c7c7c7;
    cursor: not-allowed;
  }
`;

const PostForm = () => {
  const [text, setText] = useState<string>("");
  // 미리보기 이미지
  const [preview, setPreview] = useState<string | null>(null);
  // 임시로 저장할 이미지 파일
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const user = auth.currentUser;

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  // 이미지 선택 시 Base64로 변환하여 image에 저장
  // 단, canvas 압축 방식으로 용량 압축
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return;

    const selectedFile = files[0];
    // 이후에 업로드할 이미지 파일
    setFile(selectedFile);

    // 기존 preview 정리 (메모리 누수 방지)
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    // 미리보기 용도의 이미지
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
  }

  const compressImage = (file: File) => {
    return new Promise((resolve) => {
      const image = new Image();
      // 로컬 파일을 읽을 수 있는 내장 객체
      const reader = new FileReader();

      reader.onloadend = () => {
        image.src = reader.result as string;
      };

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 600;
        const scaleSize = maxWidth / image.width;

        canvas.width = maxWidth;
        canvas.height = image.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(image, 0, 0, canvas.width, canvas.height);

        // JPEG로 압축 (품질 0.7)
        const compressedBase64 = canvas.toDataURL("image/png", 0.7);
        resolve(compressedBase64);
      };

      // 파일을 Data URL (base64 인코딩 문자열) 형태로 변환
      // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...
      reader.readAsDataURL(file);
    });
  }

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      // 저장된 이미지 파일이 있을 때
      let compressedBase64 = null;
      if (file) compressedBase64 = await compressImage(file);

      await addDoc(collection(db, "posts"), {
        text,
        image: compressedBase64,
        createdAt: serverTimestamp(),
        authorId: user?.uid,
        authorName: user?.displayName || user?.email,
        authorPhoto: user?.photoURL
      });

      setText("");
      setPreview(null);
    } catch (error) {
      console.error("Error occured while posting: ", error);
    } finally {
      setLoading(false);
    }
  }

  // 컴포넌트 언마운트 시 preview 메모리 clean-up (메모리 누수 방지)
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    }
  }, [preview]);

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <TextArea
          value={text}
          onChange={handleTextChange}
          placeholder="Express yourself"
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
        
        {/* 미리보기 이미지가 있으면 표시 */}
        {preview && (
          <PreviewImage
            src={preview}
            alt="preview"
          />
        )}

        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </SubmitButton>
      </Form>
    </Container>
  );
}

export default PostForm;