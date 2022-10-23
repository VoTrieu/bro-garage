import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";

import classes from "./MainNavigation.module.css";
import { Fragment } from "react";

function MainNavigation() {
  const navigate = useNavigate();
  const items = [
    {
      label: "Home",
      icon: "pi pi-fw pi-home",
      command: () => {
        navigate("/");
      },
    },
    {
      label: "Customer",
      icon: "pi pi-fw pi-user",
      command: () => {
        navigate("/customer");
      },
    },
    {
      label: "Users",
      icon: "pi pi-fw pi-user",
    },
    {
      label: "Events",
      icon: "pi pi-fw pi-calendar",
    },
    {
      label: "Quit",
      icon: "pi pi-fw pi-power-off",
    },
  ];

  const end = (
    <Fragment>
      <InputText placeholder="Search" type="text" className="mr-2"/>
      <Button icon="pi pi-sign-in" />
    </Fragment>
  );

  return (
    <header className={classes.header}>
      <Menubar model={items} end={end} />
    </header>
  );
}

export default MainNavigation;
