import { MENU_ITEM_ICON_COLOR } from "../../constants/colors.constant";

export const GpsBuoy = (props) => {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.5814 9L7.95637 18H28.0436L22.4186 9H13.5814ZM13.1657 7.5C12.9071 7.5 12.6667 7.63321 12.5297 7.8525L5.96719 18.3525C5.65498 18.852 6.01411 19.5 6.60319 19.5H29.3968C29.9859 19.5 30.345 18.852 30.0328 18.3525L23.4703 7.8525C23.3333 7.63321 23.0929 7.5 22.8343 7.5H13.1657Z"
        fill={props?.fill || MENU_ITEM_ICON_COLOR}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.65 21C11.3449 24.4234 14.3716 27 18 27C21.6284 27 24.6551 24.4234 25.35 21H10.65ZM9.12444 21C9.0426 20.5122 9 20.0111 9 19.5H27C27 20.0111 26.9574 20.5122 26.8756 21C26.1614 25.2566 22.4595 28.5 18 28.5C13.5405 28.5 9.83855 25.2566 9.12444 21Z"
        fill={props?.fill || MENU_ITEM_ICON_COLOR}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 18C5.58579 18 5.25 18.3358 5.25 18.75V20.25C5.25 20.6642 5.58579 21 6 21H30C30.4142 21 30.75 20.6642 30.75 20.25V18.75C30.75 18.3358 30.4142 18 30 18H6Z"
        fill={props?.fill || MENU_ITEM_ICON_COLOR}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.75 25.5C12.132 25.5 11.7792 26.2056 12.15 26.7L13.275 28.2C13.4166 28.3889 13.6389 28.5 13.875 28.5H22.125C22.3611 28.5 22.5834 28.3889 22.725 28.2L23.85 26.7C24.2208 26.2056 23.868 25.5 23.25 25.5H12.75Z"
        fill={props?.fill || MENU_ITEM_ICON_COLOR}
      />
      <path
        d="M15 11.25C15 10.4216 15.6716 9.75 16.5 9.75H19.5C20.3284 9.75 21 10.4216 21 11.25V15.75C21 16.5784 20.3284 17.25 19.5 17.25H16.5C15.6716 17.25 15 16.5784 15 15.75V11.25Z"
        fill={props?.fill || MENU_ITEM_ICON_COLOR}
      />
    </svg>
  );
};
