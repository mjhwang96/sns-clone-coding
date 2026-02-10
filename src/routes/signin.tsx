import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Title, Wrapper, Form, Input, Switcher, Error, SocialBox, SocialTitle } from "../components/auth";
import GithubButton from "../components/github-btn";

export default function Signin() {
  const navigate = useNavigate();
  // signup이 시작되면 loading = true
  const [ isLoading, setLoading ] = useState(false);
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ error, setError ] = useState("");

  const onChange=(e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value }} = e;
    // email 입력 값이 변경되면 setEmail
    if (name === "email") setEmail(value);
    // password 입력 값이 변경되면 setPassword
    else if (name === "password") setPassword(value);
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 에러 문구 초기화
    setError("");

    if (isLoading || email === "" || password === "" ) return;
    
    // signin process
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      // 메인 페이지로 이동
      navigate("/");
    } catch(e) {
      // Firebase 계정 생성 중 오류 발생
      if (e instanceof FirebaseError) {
        switch (e.code) {
          case "auth/user-not-found":
            setError("존재하지 않는 이메일입니다.");
            break;
          case "auth/wrong-password":
            setError("비밀번호가 올바르지 않습니다.");
            break;
          case "auth/invalid-email":
            setError("이메일 형식이 올바르지 않습니다.");
            break;
          case "auth/too-many-requests":
            setError("잠시 후 다시 시도해주세요. 로그인 시도가 너무 많습니다.");
            break;
          case "auth/invalid-credential":
            setError("잘못된 인증 정보입니다.");
            break;
          default:
            setError("로그인 중 오류가 발생했습니다.");
        }
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Wrapper>
      <Title>Sign In for ✈️.🐝.</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="email"
          placeholder="Email"
          type="email"
          value={email}
          required
          onChange={onChange}
        />
        <Input
          name="password"
          placeholder="Password"
          type="password"
          value={password}
          required
          onChange={onChange}
        />
        <Input
          type="submit"
          value={ isLoading ? "Loading..." : "Sign In" }
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