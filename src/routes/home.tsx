import { auth } from "./firebase";
import { toast } from "react-toastify";

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
    <h1>
      <button onClick={logOut}>Log Out</button>
    </h1>
  );
}