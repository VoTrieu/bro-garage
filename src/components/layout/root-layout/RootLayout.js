import { Fragment, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fnRefreshToken } from "../../../store/auth-actions";
import { ProgressSpinner } from "primereact/progressspinner";
import { classNames } from "primereact/utils";
import MainNavigation from "../main-navigation/MainNavigation";
import SideBarMenu from "../sidebar/SidebarMenu";

import classes from "./RootLayout.module.scss";

function RootLayout() {
  const dispatch = useDispatch();
  const isShowSpinner = useSelector((state) => state.ui.isShowSpinner);
  const { refreshToken } = useSelector((state) => state.auth);

  //refresh Token
  useEffect(() => {
    const interval = setInterval(() => {
      if (refreshToken) {
        dispatch(fnRefreshToken(refreshToken));
      }
    }, 60000 * 45);

    return () => {
      clearInterval(interval);
    };
  }, []);

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
            className={[
              classes.app_spinner,
              classNames("absolute left-50", { hidden: !isShowSpinner }),
            ]}
          />
        </main>
      </div>
    </Fragment>
  );
}

export default RootLayout;
