import { Outlet } from "react-router-dom";
import MyHeader from "../Components/MacroComponents/MyHeader";
export default function DefaultLayout({setDrawerOpen}) {
  return (
    <>
      <MyHeader setDrawerOpen={setDrawerOpen} />
      <main>
        <Outlet />
      </main>
    </>
  );
}
