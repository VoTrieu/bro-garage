import { useSelector } from "react-redux";
import { SlideMenu } from 'primereact/slidemenu';
import { useNavigate } from "react-router-dom";
const SidebarMenu = () => {
  const isShowSlidebar = useSelector((state) => state.ui.slidebarIsVisible);
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
    }
  ];

  return (
    isShowSlidebar && (
      <div className="p-3 md:w-20rem w-screen">
        <div className="card h-full w-full">
                <SlideMenu model={items} className="h-full w-full" menuWidth={286} viewportHeight={800}></SlideMenu>
            </div>
      </div>
    )
  );
};

export default SidebarMenu;
