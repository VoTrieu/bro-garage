import { useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Menubar } from "primereact/menubar";
import { Menu } from 'primereact/menu';
import { uiActions } from "../../../store/ui-slice";
import ChangePassword from "../../account/ChangePassword";
import { Button } from "primereact/button";

// import classes from "./MainNavigation.module.css";
import { Fragment } from "react";

function MainNavigation() {
  const menu = useRef(null);
  const dispatch = useDispatch();
  const fullName = useSelector((state) => state.auth.fullName);

  const toggleSlidebarMenu = () => {
    dispatch(uiActions.toggleSlidebar());
  };

  const menuItems = [
    {
        label: 'Tài khoản',
        items: [
            {
                label: 'Đổi mật khẩu',
                icon: 'pi pi-user-edit',
                command: () => {
                    dispatch(uiActions.showChangePasswordDialog(true));
                }
            },
        ]
    },
];

  const start = (
    <Fragment>
      <img
        alt="logo"
        src='/images/logo.png'
        height="40"
        className="mr-2 md:w-13rem md:mr-8 hidden md:inline"
      ></img>
      <Button icon="pi pi-bars" onClick={toggleSlidebarMenu} />
    </Fragment>
  );
  const end = (
    <div className="flex align-items-center">
      <span className="mr-2">{fullName}</span>
      <Button icon="pi pi-cog" onClick={(event) => menu.current.toggle(event)} aria-controls="popup_menu" aria-haspopup />
      <Menu model={menuItems} popup ref={menu} id="popup_menu" />
    </div>
  );

  return (
    <header>
      <Menubar model={[]} start={start} end={end} />
      <ChangePassword />
    </header>
  );
}

export default MainNavigation;
