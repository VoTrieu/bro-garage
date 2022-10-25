import { Panel } from "primereact/panel";
import { Ripple } from "primereact/ripple";

const AppPanel = (props) => {
  const template = (options) => {
    const toggleIcon = options.collapsed
      ? "pi pi-chevron-down"
      : "pi pi-chevron-up";
    const className = `${options.className} justify-content-start`;
    const titleClassName = `${options.titleClassName} pl-1`;

    return (
      <div className={className}>
        <button
          className={options.togglerClassName}
          onClick={options.onTogglerClick}
        >
          <span className={toggleIcon}></span>
          <Ripple />
        </button>
        <span className={titleClassName}>{props.header}</span>
      </div>
    );
  };

  return (
    <Panel headerTemplate={template} toggleable>
      {props.children}
    </Panel>
  );
};

export default AppPanel;
