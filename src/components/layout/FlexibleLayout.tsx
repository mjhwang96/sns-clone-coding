import type React from "react";
import styled from "styled-components";
import { Section } from "../../styles/layout";

export const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  // 부모 요소에 height: 100%;가 적용되어 있어야 아래 설정들이 적용됨
  align-items: center;
`;

// FlexLayout: UI 레이아웃 유틸
interface FlexibleLayoutProps {
  left: React.ReactNode;      // ✅ 필수
  main: React.ReactNode;      // ✅ 필수
  right?: React.ReactNode;    // ✅ 선택

  leftRatio?: number;
  mainRatio?: number;
  rightRatio?: number;
}

function FlexibleLayout({
  left,
  main,
  right,
  leftRatio = 2,
  mainRatio = 3,
  rightRatio = 2
}: FlexibleLayoutProps) {
  return (
    <Container>
      <Section $flex={leftRatio}>{left}</Section>
      <Section $flex={mainRatio}>{main}</Section>
      {right && <Section $flex={rightRatio}>{right}</Section>}
    </Container>
  )
}

export default FlexibleLayout;