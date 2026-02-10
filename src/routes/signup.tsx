import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Title, Wrapper, Form, Input, Switcher, Error } from "../components/auth";

export default function Signup() {
  const navigate = useNavigate();
  // signup이 시작되면 loading = true
  const [ isLoading, setLoading ] = useState(false);
  const [ name, setName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ error, setError ] = useState("");

  const onChange=(e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value }} = e;
    // name 입력 값이 변경되면 setName
    if (name === "name") setName(value);
    // email 입력 값이 변경되면 setEmail
    else if (name === "email") setEmail(value);
    // password 입력 값이 변경되면 setPassword
    else if (name === "password") setPassword(value);
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 에러 문구 초기화
    setError("");

    if (isLoading || name === "" || email === "" || password === "" ) return;
    
    // signup process
    try {
      /* 1. 계정 생성 (email, password)
       * 2. user 이름 설정
       * 3. 메인 페이지로 이동
       */
      setLoading(true);

      // 계정 생성에 성공하면 UserCredential을 return 받게 됨
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // UserCredential의 user 값을 대상으로 이름 설정
      await updateProfile(credentials.user, {
        displayName: name
      });
      
      // 메인 페이지로 이동
      navigate("/");
    } catch(e) {
      // Firebase 계정 생성 중 오류 발생
      if (e instanceof FirebaseError) {
        switch (e.code) {
          case "auth/email-already-in-use":
            setError("이미 사용 중인 이메일입니다.");
            break;
          case "auth/invalid-email":
            setError("이메일 형식이 올바르지 않습니다.");
            break;
          case "auth/weak-password":
            setError("비밀번호는 6자 이상이어야 합니다.");
            break;
          default:
            setError("회원가입 중 오류가 발생했습니다.");
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
      <Title>Sign Up for ✈️.🐝.</Title>
      <Form onSubmit={onSubmit}>
        <Input
          name="name"
          placeholder="Name"
          type="text"
          value={name}
          required
          onChange={onChange}
        />
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
          value={ isLoading ? "Loading..." : "Sign Up" }
        />
      </Form>
      { error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        Already have an account?{" "}
        <Link to="/signin">Sign In &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}