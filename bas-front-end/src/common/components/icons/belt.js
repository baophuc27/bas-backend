import { MENU_ITEM_ICON_COLOR } from "../../constants/colors.constant";

export const Belt = (props) => {
  return (
    <svg
      width="20"
      height="26"
      viewBox="0 0 20 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5 17.6875V11.4375C17.5 7.6 15.4625 4.3875 11.875 3.5375V2.6875C11.875 1.65 11.0375 0.8125 10 0.8125C8.9625 0.8125 8.125 1.65 8.125 2.6875V3.5375C4.55 4.3875 2.5 7.5875 2.5 11.4375V17.6875L0 20.1875V21.4375H20V20.1875L17.5 17.6875ZM10 25.1875C11.375 25.1875 12.5 24.0625 12.5 22.6875H7.5C7.5 24.0625 8.625 25.1875 10 25.1875ZM5 18.9375H15V11.4375C15 8.3375 13.1125 5.8125 10 5.8125C6.8875 5.8125 5 8.3375 5 11.4375V18.9375Z"
        fill={props?.fill || MENU_ITEM_ICON_COLOR}
      />
    </svg>
  );
};
