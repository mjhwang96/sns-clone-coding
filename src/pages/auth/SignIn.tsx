import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "../../lib/firebase";
import { useNavigate, Link } from "react-router-dom";
import {
  Title,
  LittleImage,
  Wrapper,
  Form,
  Input,
  Switcher,
  Error,
  SocialBox,
  SocialTitle
} from "../../lib/auth";
import GithubButton from "../../components/auth/GithubButton";
import planAndBee from "../../assets/images/plane-and-bee.png";

export default function Signin() {
  const navigate = useNavigate();

  // signup이 시작되면 loading = true
  const [ isLoading, setLoading ] = useState(false);
  const [ form, setForm ] = useState({
    email: "",
    password: ""
  });
  const [ error, setError ] = useState("");

  const onChange=(e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 이미 로딩 중이면 종료
    if (isLoading) return;

    const { email, password } = form;
    if (!email || !password) return;
    
    // 에러 문구 초기화
    setError("");
    setLoading(true);
    
    // signin process
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // 메인 페이지로 이동
      navigate("/");
    } catch(e) {
      // Firebase 계정 생성 중 오류 발생
      if (e instanceof FirebaseError) {
        const errorMessages: Record<string, string> = {
          "auth/user-not-found": "존재하지 않는 이메일입니다.",
          "auth/wrong-password": "비밀번호가 올바르지 않습니다.",
          "auth/invalid-email": "이메일 형식이 올바르지 않습니다.",
          "auth/too-many-requests":
            "잠시 후 다시 시도해주세요. 로그인 시도가 너무 많습니다.",
          "auth/invalid-credential": "잘못된 인증 정보입니다."
        }
        
        setError(errorMessages[e.code] ?? "로그인 중 오류가 발생했습니다.");

      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Wrapper>
      <Title>
        Sign In Plan B
        <LittleImage src={planAndBee} />
      </Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="email"
          placeholder="Email"
          type="email"
          value={form.email}
          required
          onChange={onChange}
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          required
          onChange={onChange}
        />
        <Input
          type="submit"
          value={ isLoading ? "Loading..." : "Sign In" }
          disabled={isLoading}
        />
      </Form>
      { error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        You don't have an account?{" "}
        <Link to="/signup">Sign Up &rarr;</Link>
      </Switcher>
      <SocialBox>
        <SocialTitle>소셜 로그인</SocialTitle>
        <GithubButton />
      </SocialBox>
    </Wrapper>
  );
}