import { MENU_ITEM_ICON_COLOR } from "../../constants/colors.constant";

export const Speed = (props) => {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.3999 9.27734V20H11.0449V10.9692L8.31299 11.9653V10.7422L12.1875 9.27734H12.3999ZM17.4463 12.0752L19.1821 14.9609L20.9399 12.0752H22.5293L19.9365 15.9863L22.6099 20H21.0425L19.2114 17.0264L17.3804 20H15.8057L18.4717 15.9863L15.8862 12.0752H17.4463Z"
        fill={props?.fill || MENU_ITEM_ICON_COLOR}
      />

      <rect
        x="1.5"
        y="5.5"
        width="27"
        height="19"
        rx="1.5"
        stroke={props?.fill || MENU_ITEM_ICON_COLOR}
        strokeWidth="3"
      />
    </svg>
  );
};
