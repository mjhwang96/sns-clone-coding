// 로그인한 사용자는 볼 수 있고
// 로그인하지 않은 사용자는 로그인 및 회원가입 페이지로 리디렉션
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

/* children: 컴포넌트 태그 사이에 끼워 넣은 모든 것
 * <ProtectedRoute><MainPage /></ProtectedRoute> -> MainPage가 children
 * MainPage를 그냥 보여주지 말고, ProtectedRoute라는 보안 게이트를 통과해서 보여줘
 */
export default function ProtectedRoute(
  // props.children: 구조분해
  { children }: { children: React.ReactNode }) {
    // Firebase에 로그인 정보 요청 (User or null)
    const [ , setUser ] = useState(auth.currentUser);

    const navigate = useNavigate();

    // useEffect: 컴포넌트가 렌더링된 후 실행되는 함수
    useEffect(() => {
      // "로그인 상태가 변하면 알려줘" 요청
      const unsubscribe = auth.onAuthStateChanged((currentUser) => {
        // 로그인되어 있으면 currentUser = user 정보 -> setUser(user)
        setUser(currentUser);
        // 로그아웃 상태이면 currentUser = null -> navigate("/signin")
        if (!currentUser) return navigate("/signin");
      })

      // 컴포넌트가 없어지면 구독 종료
      return unsubscribe;
    }, [navigate]);

    return children;
}