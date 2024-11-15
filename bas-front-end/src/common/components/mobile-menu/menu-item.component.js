import { useNavigate } from "react-router-dom";
import classes from "./menu-item.style.module.css";

export const MenuItem = (props) => {
  const navigate = useNavigate();

  const renderPrefixIcon = (Icon) => <Icon />;

  const onClick = () => {
    navigate(props?.to);
  };

  return (
    <div
      className={`${classes.container} ${
        props?.isActive ? classes.containerActive : ""
      }`}
      onClick={onClick}
    >
      <span className={classes.icon}>
        {props?.prefixIcon && renderPrefixIcon(props?.prefixIcon)}
      </span>

      <span
        className={`${classes.label} ${
          props?.isActive ? classes.labelActive : ""
        }`}
      >
        {props?.label}
      </span>
    </div>
  );
};
