import { MENU_ITEM_ICON_COLOR } from "../../constants/colors.constant";

export const Copy = (props) => {
  return (
    <svg
      width="16"
      height="19"
      viewBox="0 0 16 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.6667 0H1.66667C0.75 0 0 0.75 0 1.66667V13.3333H1.66667V1.66667H11.6667V0ZM14.1667 3.33333H5C4.08333 3.33333 3.33333 4.08333 3.33333 5V16.6667C3.33333 17.5833 4.08333 18.3333 5 18.3333H14.1667C15.0833 18.3333 15.8333 17.5833 15.8333 16.6667V5C15.8333 4.08333 15.0833 3.33333 14.1667 3.33333ZM5 16.6667H14.1667V5H5V16.6667Z"
        fill={props?.fill || MENU_ITEM_ICON_COLOR}
      />
    </svg>
  );
};
