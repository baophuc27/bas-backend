import { useTranslation } from "react-i18next";

export const useLanguage = () => {
  const { t, i18n } = useTranslation();

  return {
    language: i18n?.language?.split("-")?.[0],
    t,
  };
};
