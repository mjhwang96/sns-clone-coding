import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <h1>Layout Header</h1>
      <Outlet />
      <h1>Layout Footer</h1>
    </>
  );
}