import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { menuSections } from "setup/menu";
import { MenuInfo } from "./menu-info.component";
import { MenuItem } from "./menu-item.component";
import classes from "./mobile-menu.style.module.css";

export const MobileMenu = (props) => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { roleId } = useSelector((state) => state?.user);

  return (
    <div className={classes.container}>
      <div className={classes.body}>
        <div className={classes.sections}>
          {menuSections?.map((section, sectionIndex) => (
            <div className={classes.section} key={sectionIndex}>
              <MenuInfo />
              <h3 className={classes.sectionTitle}>{t(section?.labelId)}</h3>

              <div className={classes.items}>
                {section?.items
                  // ?.filter((item) => item?.role?.includes(roleId))
                  .map((item, itemIndex) => (
                    <MenuItem
                      key={itemIndex}
                      label={t(`${item?.labelId}`)}
                      prefixIcon={item?.icon}
                      to={item?.to}
                      isActive={pathname?.startsWith(item?.to)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>

        {!props?.hideBack && (
          <Link to="/" className={classes.backLink}>
            {t("common:button.back-to-map")}
          </Link>
        )}
      </div>
    </div>
  );
};
