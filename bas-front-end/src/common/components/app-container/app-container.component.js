import { HabourService } from "common/services";
import { BerthService } from "common/services/berth.service";
import { CommonService } from "common/services/common.service";
import { UserManagementService } from "common/services/user-management.service";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import {
  setBerths,
  setBerthStatuses,
  setUserRoles,
} from "redux/slices/enumeration.slice";
import { setHabourData } from "redux/slices/habour.slice";
import { setOrganizationData } from "redux/slices/organization.slice";

export const AppContainer = (props) => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state?.user);

  const fetchOrganizationData = async () => {
    try {
      const response = await CommonService.getOrganizationData();

      if (response?.data?.success) {
        dispatch(setOrganizationData(response?.data?.data));
      }
    } catch (error) {}
  };

  const fetchHabourData = async () => {
    try {
      const response = await HabourService.getData();

      if (response?.data?.success) {
        dispatch(setHabourData(response?.data?.data));
      }
    } catch (error) {}
  };

  const fetchBerthStatuses = async () => {
    try {
      const response = await BerthService.getStatuses();

      if (response?.data?.success) {
        dispatch(setBerthStatuses(response?.data?.data));
      }
    } catch (error) {}
  };

  const fetchUserRoles = async () => {
    try {
      const response = await UserManagementService.getAllRoles();

      if (response?.data?.success) {
        dispatch(setUserRoles(response?.data?.data));
      }
    } catch (error) {}
  };

  const fetchBerths = async () => {
    try {
      const response = await BerthService.getAll();
      if (response?.data?.success) {
        dispatch(setBerths(response?.data?.data));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrganizationData();
    fetchHabourData();
    fetchBerthStatuses();
    fetchUserRoles();
    fetchBerths();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if (!isLoggedIn) {
  //   return <Navigate to="/auth/login" replace />;
  // }

  return <Outlet />;
};
