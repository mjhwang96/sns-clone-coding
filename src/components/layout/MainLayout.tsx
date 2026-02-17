import { Outlet } from "react-router-dom";
import styled from "styled-components";
import FlexibleLayout from "./FlexibleLayout";
import NavigationBar from "./NavigationBar";
import flyingBee from "../../assets/images/flying-bee.png";
import { Content, Sidebar } from "../../styles/layout";

const Logo = styled.img`
  position: fixed;
  top: 10px;
  left: 10px;
  width: 80px;
  height: 80px;
`;

export default function MainLayout() {
  return (
    <>
      <Logo src={flyingBee}/>
      <FlexibleLayout
        left={
          <Sidebar>
            <NavigationBar />
          </Sidebar>
        }
        main={
          <Content>
            <Outlet />
          </Content>
        }
        right={
          <p>Aside Content</p>
        }
        leftRatio={0.5}
        mainRatio={8}
        rightRatio={1.5}
      />
    </>
  );
}