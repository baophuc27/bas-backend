import { MENU_ITEM_ICON_COLOR } from "../../constants/colors.constant";

export const Close = (props) => {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.7084 2.34824L18.6522 0.291992L10.5001 8.44408L2.348 0.291992L0.291748 2.34824L8.44383 10.5003L0.291748 18.6524L2.348 20.7087L10.5001 12.5566L18.6522 20.7087L20.7084 18.6524L12.5563 10.5003L20.7084 2.34824Z"
        fill={props?.fill || MENU_ITEM_ICON_COLOR}
      />
    </svg>
  );
};
