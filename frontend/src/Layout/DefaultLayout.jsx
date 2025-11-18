import { Outlet } from "react-router-dom";
import MyHeader from "../Components/MacroComponents/MyHeader";
import CartTab from "../Components/MacroComponents/CartTab";
export default function DefaultLayout() {
  return (
    <>
      <MyHeader />
      <main>
        <Outlet />
      </main>
    </>
  );
}
