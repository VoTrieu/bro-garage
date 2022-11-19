import { useSelector } from "react-redux";
import { SlideMenu } from "primereact/slidemenu";
import { useNavigate } from "react-router-dom";
const SidebarMenu = () => {
  const isShowSlidebar = useSelector((state) => state.ui.slidebarIsVisible);
  const navigate = useNavigate();
  const items = [
    {
      label: "Trang Chủ",
      icon: "pi pi-fw pi-home",
      command: () => {
        navigate("/app/home");
      },
    },
    {
      label: "Khách Hàng",
      icon: "pi pi-fw pi-user",
      command: () => {
        navigate("/app/customers");
      },
    },
    {
      label: "Phụ tùng",
      icon: "pi pi-fw pi-box",
      command: () => {
        navigate("/app/spare-part");
      },
    },
    {
      label: "Chu kỳ bảo dưỡng",
      icon: "pi pi-fw pi-car",
      command: () => {
        navigate("/app/maintainance-cycles");
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
            menuWidth={286}
            viewportHeight={800}
          ></SlideMenu>
        </div>
      </div>
    )
  );
};

export default SidebarMenu;
