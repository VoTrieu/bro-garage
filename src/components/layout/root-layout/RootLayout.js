import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import MainNavigation from "../main-navigation/MainNavigation";
import SideBarMenu from "../sidebar/SidebarMenu";

import classes from "./RootLayout.module.css";

function RootLayout({ children }) {
  return (
    <Fragment>
      <MainNavigation />
      <div className={`flex ${classes.main_container}`}>
        <SideBarMenu />
        <main className="w-full h-full px-4 pt-3">
          <Outlet />
        </main>
      </div>
    </Fragment>
  );
}

export default RootLayout;
