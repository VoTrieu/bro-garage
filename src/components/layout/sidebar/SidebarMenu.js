import { useSelector } from "react-redux";
import { SlideMenu } from 'primereact/slidemenu';
import { useNavigate } from "react-router-dom";
const SidebarMenu = () => {
  const isShowSlidebar = useSelector((state) => state.ui.slidebarIsVisible);
    const navigate = useNavigate();
  const items = [
    {
      label: "Trang Chủ",
      icon: "pi pi-fw pi-home",
      command: () => {
        navigate("/");
      },
    },
    {
      label: "Khách Hàng",
      icon: "pi pi-fw pi-user",
      command: () => {
        navigate("/customers");
      },
    }
  ];

  return (
    isShowSlidebar && (
      <div className="p-3 pb-0 pr-0 md:w-20rem w-screen">
        <div className="card h-full w-full overflow-hidden">
                <SlideMenu model={items} className="h-full w-full" menuWidth={286} viewportHeight={800}></SlideMenu>
            </div>
      </div>
    )
  );
};

export default SidebarMenu;
