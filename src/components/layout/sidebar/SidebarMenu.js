import { useSelector } from "react-redux";
import { Card } from "primereact/card";
const SidebarMenu = () => {
  const isShowSlidebar = useSelector((state) => state.ui.slidebarIsVisible);
  return (
    isShowSlidebar && (
      <div className="p-3 md:w-20rem w-screen">
        <Card className="h-full ">Content</Card>
      </div>
    )
  );
};

export default SidebarMenu;
