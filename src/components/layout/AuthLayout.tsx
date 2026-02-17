import type { PropsWithChildren } from "react";
import FlexibleLayout from "./FlexibleLayout";
import flyingBee from "../../assets/images/flying-bee.png";
import { Content, MainImage, Sidebar } from "../../styles/layout";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <FlexibleLayout
      left={
        <Sidebar>
          <MainImage src={flyingBee} alt="platform" />
        </Sidebar>
      }
      main={
        <Content>{children}</Content>
      }
      leftRatio={2}
      mainRatio={3}
    />
  );
}