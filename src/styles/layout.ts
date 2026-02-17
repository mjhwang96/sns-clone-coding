// signin, signup의 공유 라이브러리
import { styled } from "styled-components";

export const Wrapper = styled.div`
  width: 60%;
  padding: 50px 40px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.borderColor};

  transition: background-color 0.3s ease, color 0.3s ease;
`;

// flex: ${(props) => props.$flex};
// flex: ${({ $flex }) => $flex};
export const Section = styled.div<{ $flex: number}>`
  flex: ${({ $flex }) => $flex};
`;

export const Sidebar = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MainImage = styled.img`
  width: 70%;
`;

export const Title = styled.h1`
  font-size: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Form = styled.form`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-bottom: 10px;
`;

export const Input = styled.input`
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  width: 100%;
  font-size: 16px;

  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const Error = styled.span`
  font-weight: 600;
  color: tomato;
`;

export const Switcher = styled.span`
  margin-top: 20px;
  a {
    color: #1d9bf0;
  }
`;

export const SocialBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 30px;
`;

export const SocialTitle = styled.span`
width: 100%;
  display: flex;
  align-items: center;
  color: #999;
  font-size: 13px;
  font-weight: 500;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #ddd;
  }

  &::before {
    margin-right: 12px;
  }

  &::after {
    margin-left: 12px;
  }
`;

export const LittleImage = styled.img`
  width: 70%;
  max-width: 100px;
`;