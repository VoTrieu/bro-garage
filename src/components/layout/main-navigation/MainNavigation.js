import { useDispatch } from "react-redux";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { uiActions } from "../../../store/ui-slice";
// import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

// import classes from "./MainNavigation.module.css";
import { Fragment } from "react";

function MainNavigation() {
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const items = [
    // {
    //   label: "Home",
    //   icon: "pi pi-fw pi-home",
    //   command: () => {
    //     navigate("/");
    //   },
    // },
    // {
    //   label: "Customer",
    //   icon: "pi pi-fw pi-user",
    //   command: () => {
    //     navigate("/customer");
    //   },
    // }
  ];

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
    <Fragment>
      <InputText placeholder="Search" type="text" className="mr-2" />
      <Button icon="pi pi-sign-in" />
    </Fragment>
  );

  return (
    <header>
      <Menubar model={items} start={start} end={end} />
    </header>
  );
}

export default MainNavigation;
