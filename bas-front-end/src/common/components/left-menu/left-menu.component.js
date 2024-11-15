import { IconButton } from "@material-ui/core";
import { ChevronLeft } from "@material-ui/icons";
import { usePermission } from "common/hooks";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { menuSections } from "setup/menu";
import classes from "./left-menu.style.module.css";
import { MenuItem } from "./menu-item.component";

export const LeftMenu = (props) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { roleId } = useSelector((state) => state?.user);
  const { hasPermission } = usePermission();

  const [collapse, setCollapse] = useState(
    window.innerWidth > 1024 ? false : true
  );

  // add listener to window resize
  useEffect(() => {
    window.addEventListener("resize", () => {
      setCollapse(window.innerWidth > 1024 ? false : true);
    });
  }, []);

  return (
    <div
      className={`${classes.container} ${
        collapse ? classes.containerCollapse : ""
      }`}
    >
      <div className={classes.header}>
        {!collapse && (
          <Link to="/dashboard">
            <h1 className={classes.title}>{t("common:app.name")}</h1>
          </Link>
        )}

        <IconButton
          onClick={() => setCollapse(!collapse)}
          style={{
            marginRight: -14,
            ...(collapse && { marginLeft: -20, rotate: "180deg" }),
          }}
        >
          <ChevronLeft />
        </IconButton>
      </div>

      <div className={classes.body}>
        <div className={classes.sections}>
          {menuSections?.map((section, sectionIndex) => (
            <div className={classes.section} key={sectionIndex}>
              <h3
                className={`${classes.sectionTitle} ${
                  collapse && classes.sectionTitleCollapse
                }`}
              >
                {t(section?.labelId)}
              </h3>

              <div className={classes.items}>
                {section?.items
                  ?.filter(
                    (item) =>
                      item?.common === true || hasPermission(item?.feature)
                  )
                  ?.map((item, itemIndex) => (
                    <MenuItem
                      key={itemIndex}
                      label={collapse ? "" : t(`${item?.labelId}`)}
                      prefixIcon={item?.icon}
                      to={item?.to}
                      isActive={pathname?.startsWith(item?.to)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>

        <Link
          to="/"
          className={`${classes.backLink} ${
            collapse && classes.backLinkCollapse
          }`}
        >
          {collapse ? t("common:back") : t("common:button.back-to-map")}
        </Link>
      </div>
    </div>
  );
};
