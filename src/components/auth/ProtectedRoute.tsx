// 로그인한 사용자는 MainLayout 랜더링
// 로그인하지 않은 사용자는 로그인 및 회원가입 페이지로 리디렉션
import { auth, db } from "../../lib/firebase";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, type ReactNode } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

/* children: 컴포넌트 태그 사이에 끼워 넣은 모든 것
 * <ProtectedRoute><MainPage /></ProtectedRoute> -> MainPage가 children
 * MainPage를 그냥 보여주지 말고, ProtectedRoute라는 보안 게이트를 통과해서 보여줘
 */

type Props = {
  children?: ReactNode;
}
export default function ProtectedRoute({ children }: Props) {
  const [ , setLoading] = useState(true);
  const [ , setUser ] = useState(auth.currentUser);
  const navigate = useNavigate();

  // useEffect: 컴포넌트 마운트 시 한 번 실행
  useEffect(() => {
    // onAuthStateChanged가 반환하는 구독 해제 함수를 담기 위한 변수
    let unsubscribe: (() => void) | undefined;

    // (async() => {})() -> 함수 즉시 실행
    (async() => {
      // 앱 시작 시 로그인 상태가 확정될 때까지 기다림
      await auth.authStateReady();

      unsubscribe = auth.onAuthStateChanged(async(currentUser) => {
        setUser(currentUser);
        
        // 로그인 상태
        if (currentUser) {
          // Firestore users 컬렉션 업데이트
          await setDoc(
            doc(db, "users", currentUser.uid),
            {
              displayName: currentUser.displayName ?? "",
              photoURL: currentUser.photoURL ?? "",
              updatedAt: serverTimestamp()
            },
            { merge: true }
          );
          setLoading(false);
        }
        // 로그아웃 상태 -> 리다이렉트
        else {
          setLoading(false);
          navigate("/signin");
        }
      });
    })();

    // cleanup: 구독 해제
    return () => unsubscribe?.();
  }, [navigate]);

  return <>{ children ?? <Outlet /> }</>;
}