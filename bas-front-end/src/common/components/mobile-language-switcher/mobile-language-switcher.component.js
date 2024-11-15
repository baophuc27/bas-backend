import React, { useEffect, useRef, useState } from "react";
import VI_FLAG from "assets/images/vi-flag.svg";
import EN_FLAG from "assets/images/en-flag.svg";
import classes from "./mobile-language-switcher.style.module.css";
import { useTranslation } from "react-i18next";
import i18n from "setup/i18n";

export const MobileLanguageSwitcher = (props) => {
  const { t } = useTranslation();
  const LANGUAGES = [
    {
      id: 1,
      label: t("common:language.vietnamese"),
      value: "VI",
      icon: VI_FLAG,
      code: ["vi", "vi-VN"],
    },
    {
      id: 2,
      label: t("common:language.english"),
      value: "EN",
      icon: EN_FLAG,
      code: ["en", "en-US"],
    },
  ];
  const [active, setActive] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (active) {
      document.addEventListener("click", handleClick);
    }

    return () => {
      document.removeEventListener("click", handleClick);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const handleClick = (event) => {
    const { target } = event;

    if (!ref?.current?.contains(target)) {
      setActive(false);
      document.removeEventListener("click", handleClick);
    }
  };

  const switchLanguage = async (code) => {
    if (code === i18n.language) return;

    try {
      window.localStorage.setItem("i18nextLng", code);
      i18n.changeLanguage(code);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDropdown = () => {
    setActive(!active);
  };

  return (
    <div className={classes.languageSwitcher}>
      <div
        className={classes.currentLanguage}
        onClick={handleDropdown}
        ref={ref}
      >
        <div className={classes.wrapper}>
          <img
            src={
              LANGUAGES.find((item) =>
                item?.code?.includes(i18n?.language?.split("-")?.[0])
              )?.icon
            }
            alt=""
          />
          <span>
            {
              LANGUAGES.find((item) =>
                item?.code?.includes(i18n?.language?.split("-")?.[0])
              )?.label
            }
          </span>
        </div>
      </div>

      <div className={`${classes.dropdown} ${active ? classes.active : ""}`}>
        <ul className={classes.list}>
          {LANGUAGES.map((item) => (
            <li key={item.id} onClick={() => switchLanguage(item.code)}>
              <img src={item.icon} alt="" />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
