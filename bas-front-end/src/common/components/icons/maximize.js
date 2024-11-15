import { MENU_ITEM_ICON_COLOR } from "../../constants/colors.constant";

export const Maximize = (props) => {
  return (
    <svg
      width="35"
      height="35"
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.91667 14.5837H5V7.29199H12.2917V10.2087H7.91667V14.5837ZM5 20.417H7.91667V24.792H12.2917V27.7087H5V20.417ZM27.6666 24.792H23.2916V27.7087H30.5833V20.417H27.6666V24.792ZM23.2916 10.2087V7.29199H30.5833V14.5837H27.6666V10.2087H23.2916Z"
        fill={props?.fill || MENU_ITEM_ICON_COLOR}
      />
    </svg>
  );
};
