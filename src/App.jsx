import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Sidebar from "./component/layout/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      <SignedIn>
        <Sidebar />
        <Outlet />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};
export default App;
