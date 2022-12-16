import { useSelector } from "react-redux";
import { SlideMenu } from "primereact/slidemenu";
import {
  useNavigate,
  useLocation,
  useMatch,
  matchRoutes,
} from "react-router-dom";
const SidebarMenu = () => {
  const isShowSlidebar = useSelector((state) => state.ui.slidebarIsVisible);
  const navigate = useNavigate();
  const location = useLocation();
  const items = [
    {
      label: "Trang Chủ",
      icon: "pi pi-fw pi-home",
      className: useMatch("/app/home") ? "surface-hover" : "",
      command: () => {
        navigate("/app/home");
      },
    },
    {
      label: "Khách Hàng",
      icon: "pi pi-fw pi-user",
      className: matchRoutes(
        [
          { path: "/app/customers" },
          { path: "/app/customer-detail/new" },
          { path: "/app/customer-detail/:id" },
        ],
        location
      )
        ? "surface-hover"
        : "",
      command: () => {
        navigate("/app/customers");
      },
    },
    {
      label: "Phụ tùng",
      icon: "pi pi-fw pi-box",
      className: matchRoutes([{ path: "/app/spare-part" }], location)
        ? "surface-hover"
        : "",
      command: () => {
        navigate("/app/spare-part");
      },
    },
    {
      label: "Chu kỳ bảo dưỡng",
      icon: "pi pi-fw pi-car",
      className: matchRoutes(
        [
          { path: "/app/maintainance-cycles" },
          { path: "/app/maintainance-cycle-detail/new" },
          { path: "/app/maintainance-cycle-detail/:id" },
        ],
        location
      )
        ? "surface-hover"
        : "",
      command: () => {
        navigate("/app/maintainance-cycles");
      },
    },
    {
      label: "Phiếu bão dưỡng / sửa chữa",
      icon: "pi pi-fw pi-cog",
      className: matchRoutes(
        [
          { path: "/app/repair" },
          { path: "/app/repair-detail/new" },
          { path: "/app/repair-detail/:id" },
        ],
        location
      )
        ? "surface-hover"
        : "",
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
