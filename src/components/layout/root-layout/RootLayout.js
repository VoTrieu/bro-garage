import { Fragment } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { ProgressSpinner } from "primereact/progressspinner";
import { classNames } from "primereact/utils";
import MainNavigation from "../main-navigation/MainNavigation";
import SideBarMenu from "../sidebar/SidebarMenu";

import classes from "./RootLayout.module.scss";

function RootLayout() {
  const isShowSpinner = useSelector((state) => state.ui.isShowSpinner);
  return (
    <Fragment>
      <MainNavigation />
      <div className={`flex ${classes.main_container}`}>
        <SideBarMenu />
        <main className="w-full h-full px-4 pt-3 relative">
          <Outlet />
          <ProgressSpinner
            style={{ width: "50px", height: "50px" }}
            strokeWidth="4"
            fill="var(--surface-ground)"
            animationDuration=".5s"
            className={[classes.app_spinner, classNames('absolute left-50', {'hidden': !isShowSpinner})]}
          />
        </main>
      </div>
    </Fragment>
  );
}

export default RootLayout;
