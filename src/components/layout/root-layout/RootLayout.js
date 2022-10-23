import { Fragment } from "react";
import MainNavigation from "../main-navigation/MainNavigation";
import SideBarMenu from "../sidebar/SidebarMenu";

import classes from "./RootLayout.module.css";

function RootLayout({ children }) {
  return (
    <Fragment>
      <MainNavigation />
      <div className={`flex ${classes.main_container}`}>
        <SideBarMenu />
        <main>{children}</main>
      </div>
    </Fragment>
  );
}

export default RootLayout;
