// User Profile 페이지
import { useEffect, useRef, useState } from "react";
import { auth, db } from "../../lib/firebase";
import styled from "styled-components";
import defaultAvatar from "../../assets/images/default-avatar.png";
import PostList from "../../components/post/PostList";    // default import
import { doc, getDoc, setDoc } from "firebase/firestore"; // named import
import { uploadImage } from "../../services/cloudinary";

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
  cursor: pointer;
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
  }, []);
  
  console.log(user?.uid);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. 즉시 미리보기 (로컬 이미지)
    setAvatar(URL.createObjectURL(file));

    // 2. Cloudinary에 이미지 업로드
    const imageUrl = await uploadImage(file, "profile");
    console.log(imageUrl);
    if (!imageUrl) return;

    // 3. 실제 URL로 교체
    setAvatar(imageUrl);
    
    // 4. Firestore에 저장
    if (!user) return;
    const userRef = doc(db, "users", user.uid);

    await setDoc(userRef,
      { photoURL: imageUrl },
      { merge: true }
    );
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