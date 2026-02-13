import { styled } from "styled-components";
import { auth } from "../lib/firebase";
import { toast } from "react-toastify";
import PostForm from "../components/post/PostForm";
import PostList from "../components/post/PostList";


const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
`;

export default function Home() {
  const logOut = async() => {
    try {
      // 비동기 함수
      await auth.signOut();
      // 화면 상단 팝업
      toast.success("로그아웃 되었습니다!");
    } catch(e) {
      console.error("로그아웃 실패", e);
    }
  };

  return (
    <Wrapper>
      <PostForm />
      <PostList />
      <button onClick={logOut}>Log Out</button>
    </Wrapper>
  );
}