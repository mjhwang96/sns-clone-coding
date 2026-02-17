import { useState } from "react";
import { styled } from "styled-components";
import PostForm from "../../components/post/PostForm";
import PostList from "../../components/post/PostList";

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  width: 60%;
  height: 100vh;
`;

const ListArea = styled.div`
  overflow-y: auto;
`;

const ToggleButton = styled.button`
  margin-bottom: 12px;
  padding: 8px 14px;
  border-radius: 20px;
  border: none;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #b6d6ec;
  }
`;

export default function Home() {
  // 접기, 펼치기 UX를 위한 토글 추가
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Wrapper>
      <ToggleButton onClick={() => setIsOpen(prev => !prev)}>
        {isOpen ? "✖ Close" : "✏️ Write"}
      </ToggleButton>

      {isOpen && <PostForm />}

      <ListArea>
        <PostList />
      </ListArea>
    </Wrapper>
  );
}