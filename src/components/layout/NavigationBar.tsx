import { useRef, useState } from "react";
import styled from "styled-components";
import { auth } from "../../lib/firebase";
import { useNavigate } from "react-router-dom";

const Bar = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  left: 10px;
  align-items: center;
  justify-content: center; // 세로 중앙
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;
  gap: 20px;
  background-color: ${({ theme }) => theme.cardBackground};
  border: 0.8px solid ${({ theme }) => theme.borderColor};
  border-radius: 15px;
`;

interface MenuItemProps {
  $active?: boolean;
}

const MenuItem = styled.div<MenuItemProps>`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textColor};
  width: 40px;
  height: 40px;
  border-radius: 8px;

  svg {width: 30px;}

  &:hover {
    background-color: ${({ theme }) => theme.backgroundColor};
  }

  background-color: ${ ({ $active, theme }) =>
    $active ? theme.backgroundColor : "transparent" }
`;

const SubMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 100%;
  margin-left: 10px;
  padding: 5px;
  gap: 20px;
  background-color: ${({ theme }) => theme.cardBackground};
  border: 0.8px solid ${({ theme }) => theme.borderColor};
  border-radius: 12px;
`;

const SubMenuItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;

  svg {
    width: 30px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.backgroundColor};
  }
`;

export default function NavigationBar() {
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);
  // SubMenu의 열림 상태
  const [ isOpen, setIsOpen ] = useState(false);
  
  const onSignOut = async() => {
    const signOutConfirm = confirm("Are you sure to sign out?");
    
    if (signOutConfirm) {
      await auth.signOut();
      navigate("/signin");
    }
  };

  return (
    <Bar>
      <Menu>
        { /* Home */ }
        <MenuItem onClick={() => navigate("/")}>
          { /* currentColor는 부모의 color를 따라감 */ }
          <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path clipRule="evenodd" fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" />
          </svg>
        </MenuItem>

        { /* Write */ }
        <MenuItem>
          <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.886L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.419a4 4 0 0 0-.885 1.343Z" />
          </svg>
        </MenuItem>

        {/* User - Icon + SubMenu Wrapper */}
        <div ref={userMenuRef} style={{ position: "relative" }}>
          <MenuItem
            $active={isOpen}
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
            </svg>
          </MenuItem>

          {isOpen && (
            <SubMenu>
              {/* User Profile */}
              <SubMenuItem onClick={() => navigate("/profile")}>
                <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clipRule="evenodd" fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-5.5-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 12a5.99 5.99 0 0 0-4.793 2.39A6.483 6.483 0 0 0 10 16.5a6.483 6.483 0 0 0 4.793-2.11A5.99 5.99 0 0 0 10 12Z" />
                </svg>
              </SubMenuItem>
              <SubMenuItem onClick={ onSignOut }>
                <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path clipRule="evenodd" fillRule="evenodd" d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25Z" />
                  <path clipRule="evenodd" fillRule="evenodd" d="M14 10a.75.75 0 0 0-.75-.75H3.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 14 10Z" />
                </svg>
              </SubMenuItem>
            </SubMenu>
          )}
        </div>
      </Menu>
    </Bar>
  );
}