import { useDispatch } from "react-redux";
import * as pageConfigSlice from "redux/slices/page-config.slice";

export const usePageConfig = () => {
  const dispatch = useDispatch();

  const setPageTitle = ({ id, params }) => {
    dispatch(
      pageConfigSlice.setPageTitle({
        id,
        params,
      })
    );
  };

  const hideBreadcrumbs = () => {
    dispatch(pageConfigSlice.hideBreadcrumbs());
  };

  const setBreadcrumbsList = ({ id }) => {
    dispatch(
      pageConfigSlice.setBreadcrumbsList({
        id,
      })
    );
  };

  return {
    setPageTitle,
    hideBreadcrumbs,
    setBreadcrumbsList,
  };
};
