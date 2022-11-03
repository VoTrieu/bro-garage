import { useDispatch, useSelector } from "react-redux";
import { Menubar } from "primereact/menubar";
import { uiActions } from "../../../store/ui-slice";
import Login from "../../login/Login";
import { Button } from "primereact/button";

// import classes from "./MainNavigation.module.css";
import { Fragment } from "react";

function MainNavigation() {
  const dispatch = useDispatch();
  const fullName = useSelector((state) => state.auth.fullName);

  const toggleSlidebarMenu = () => {
    dispatch(uiActions.toggleSlidebar());
  };

  const start = (
    <Fragment>
      <img
        alt="logo"
        src={require("../../../images/garage-logo.webp")}
        height="40"
        className="mr-2 md:w-13rem md:mr-8 hidden md:inline"
      ></img>
      <Button icon="pi pi-bars" onClick={toggleSlidebarMenu} />
    </Fragment>
  );
  const end = (
    <div className="flex align-items-center">
      <span className="mr-2">{fullName}</span>
      <Button
        icon="pi pi-sign-in"
        onClick={() => {
          dispatch(uiActions.showLoginDialog(true));
        }}
      />
    </div>
  );

  return (
    <header>
      <Menubar model={[]} start={start} end={end} />
      <Login />
    </header>
  );
}

export default MainNavigation;
