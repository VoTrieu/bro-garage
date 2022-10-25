import { Button } from "primereact/button";

const Footer = (props) => {
  return (
    <div className="flex justify-content-end p-menubar w-full h-3rem absolute bottom-0 mb-1">
      {props?.items?.map((item) => (
        <Button
          key={item.label}
          label={item.label}
          icon={item.icon}
          className={`${item.className} mx-2`}
          onClick={item.action}
        />
      ))}
    </div>
  );
};

export default Footer;
