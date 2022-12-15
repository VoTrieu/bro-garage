import { useSelector } from "react-redux";
import { SlideMenu } from "primereact/slidemenu";
import { useNavigate, useMatch } from "react-router-dom";
const SidebarMenu = () => {
  const isShowSlidebar = useSelector((state) => state.ui.slidebarIsVisible);
  const navigate = useNavigate();
  const items = [
    {
      label: "Trang Chủ",
      icon: "pi pi-fw pi-home",
      className: useMatch('/app/home') ? 'surface-hover' : '',
      command: () => {
        navigate("/app/home");
      },
    },
    {
      label: "Khách Hàng",
      icon: "pi pi-fw pi-user",
      className: useMatch('/app/customers') ? 'surface-hover' : '',
      command: () => {
        navigate("/app/customers");
      },
    },
    {
      label: "Phụ tùng",
      icon: "pi pi-fw pi-box",
      className: useMatch('/app/spare-part') ? 'surface-hover' : '',
      command: () => {
        navigate("/app/spare-part");
      },
    },
    {
      label: "Chu kỳ bảo dưỡng",
      icon: "pi pi-fw pi-car",
      className: useMatch('/app/maintainance-cycles') ? 'surface-hover' : '',
      command: () => {
        navigate("/app/maintainance-cycles");
      },
    },
    {
      label: "Phiếu bão dưỡng / sửa chữa",
      icon: "pi pi-fw pi-cog",
      className: useMatch('/app/repair') ? 'surface-hover' : '',
      command: () => {
        navigate("/app/repair");
      },
    },
  ];

  return (
    isShowSlidebar && (
      <div className="p-3 pb-0 pr-0">
        <div className="card h-full w-20rem overflow-hidden ">
          <SlideMenu
            model={items}
            className="h-full w-full"
            menuWidth={318}
            viewportHeight={800}
          ></SlideMenu>
        </div>
      </div>
    )
  );
};

export default SidebarMenu;
