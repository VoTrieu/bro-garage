import { Fragment, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fnRefreshToken } from "../../../store/auth-actions";
import { ProgressSpinner } from "primereact/progressspinner";
import { classNames } from "primereact/utils";
import { getTimestampInSeconds } from "../../../utils/Utils";
import MainNavigation from "../main-navigation/MainNavigation";
import SideBarMenu from "../sidebar/SidebarMenu";

import classes from "./RootLayout.module.scss";

function RootLayout() {
  const dispatch = useDispatch();
  const { isShowSpinner, slidebarIsVisible } = useSelector((state) => state.ui);
  const { refreshToken, expirationTime } = useSelector((state) => state.auth);

  //refresh Token
  useEffect(() => {
    let remainTime = expirationTime - getTimestampInSeconds();
    const interval = setInterval(() => {
      if (refreshToken) {
        dispatch(fnRefreshToken(refreshToken));
      }
    }, (remainTime - 10) * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [refreshToken, expirationTime]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Fragment>
      <MainNavigation />
      <div className={`flex ${classes.main_container}`}>
        <SideBarMenu />
        <main
          className={classNames(
            classes.side_bar_open,
            "h-full px-4 pt-3 relative",
            {
              "w-full": !slidebarIsVisible,
            }
          )}
        >
          <Outlet />
          <ProgressSpinner
            style={{ width: "50px", height: "50px" }}
            strokeWidth="4"
            fill="var(--surface-ground)"
            animationDuration=".5s"
            className={[
              classes.app_spinner,
              classNames("absolute left-50 bottom-50", { hidden: !isShowSpinner }),
            ]}
          />
        </main>
      </div>
    </Fragment>
  );
}

export default RootLayout;
