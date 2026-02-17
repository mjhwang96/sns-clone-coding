// User Profile 페이지
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../../lib/firebase";
import styled from "styled-components";
import defaultAvatar from "../../assets/images/default-avatar.png";
import PostList from "../../components/post/PostList";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  width: 60%;
  height: 100vh;
`;

const ProfileHeader = styled.div`
  text-align: center;
  padding: 40px 0;
`;

const Avatar = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const Name = styled.h2`
  font-size: 20px;
  font-weight: 600;
`;

const ListArea = styled.div`
  overflow-y: auto;
`;

// 압축된 Base64 이미지 파일로 변환
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.src = reader.result as string;
    }

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxWidth = 600;
      const scaleSize = maxWidth / img.width;

      canvas.width = maxWidth;
      canvas.height = img.height * scaleSize;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressedBase64 = canvas.toDataURL("image/png", 0.5);
      resolve(compressedBase64);
    };

    reader.readAsDataURL(file);
  })
}

const Profile = () => {
  const user = auth.currentUser;
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(user?.photoURL || null);

  // Firestore에서 프로필 사진 불러오기 (실시간)
  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user) return;
      
      const userRef = doc(db, "users", user.uid);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        setAvatar(data.photoURL || null);
      } else {
        setAvatar(user.photoURL || null);
      }
    }

    fetchAvatar();
  }, [user]);
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files) return;

    const selectedFile = files[0];
    const compressedBase64 = await compressImage(selectedFile);

    console.log(compressedBase64);
    // Firestore 1MB 제한 체크
    if (compressedBase64.length > 1024 * 1024) {
      alert("이미지 용량이 너무 큽니다. (1MB 초과)");
      return;
    }
    
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef,
      { photoURL: compressedBase64 },
      { merge: true }
    );

    setAvatar(compressedBase64);
  };

  return (
    <Wrapper>
      <ProfileHeader>
        <Avatar
          src={avatar || defaultAvatar}
          alt="Profile Avatar"
          onClick={() => fileRef.current?.click()}
        />
        <HiddenInput
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <Name>{user?.displayName}</Name>
      </ProfileHeader>

      <ListArea>
        <PostList userId={user?.uid} />
      </ListArea>
    </Wrapper>
  );
}

export default Profile;