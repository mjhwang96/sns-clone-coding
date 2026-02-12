import type { PropsWithChildren } from "react";
import flyingBee from "../../assets/images/flying-bee.png";

import { Container, Left, MainImage, Right } from "../../lib/auth";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <Container>
      <Left>
        <MainImage src={flyingBee} alt="platform" />
      </Left>
      <Right>
        {children}
      </Right>
    </Container>
  );
}