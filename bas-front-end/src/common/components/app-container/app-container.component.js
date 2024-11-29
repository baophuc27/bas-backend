import { HabourService } from "common/services";
import { BerthService } from "common/services/berth.service";
import { CommonService } from "common/services/common.service";
import { UserManagementService } from "common/services/user-management.service";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
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
  const [isInitialLoad, setIsInitialLoad] = useState(false);

  const fetchOrganizationData = async () => {
    try {
      const response = await CommonService.getOrganizationData();
      if (response?.data?.success) {
        dispatch(setOrganizationData(response?.data?.data));
      }
    } catch (error) {
      console.error("Error fetching organization data:", error);
    }
  };

  const fetchHabourData = async () => {
    try {
      const response = await HabourService.getData();
      if (response?.data?.success) {
        dispatch(setHabourData(response?.data?.data));
      }
    } catch (error) {
      console.error("Error fetching habour data:", error);
    }
  };

  const fetchBerthStatuses = async () => {
    try {
      const response = await BerthService.getStatuses();
      if (response?.data?.success) {
        dispatch(setBerthStatuses(response?.data?.data));
      }
    } catch (error) {
      console.error("Error fetching berth statuses:", error);
    }
  };

  const fetchUserRoles = async () => {
    try {
      const response = await UserManagementService.getAllRoles();
      if (response?.data?.success) {
        dispatch(setUserRoles(response?.data?.data));
      }
    } catch (error) {
      console.error("Error fetching user roles:", error);
    }
  };

  const fetchBerths = async () => {
    try {
      const response = await BerthService.getAll();
      if (response?.data?.success) {
        dispatch(setBerths(response?.data?.data));
      }
    } catch (error) {
      console.error("Error fetching berths:", error);
    }
  };

  useEffect(() => {
    // Tải dữ liệu ban đầu khi trang được tải
    const initialLoad = async () => {
      await fetchOrganizationData();
      await fetchHabourData();
      await fetchBerthStatuses();
      await fetchBerths();
      setIsInitialLoad(true);
    };

    initialLoad();
  }, []); // Chạy một lần khi trang tải

  useEffect(() => {
    // Reload lại dữ liệu sau khi đăng nhập
    if (isLoggedIn) {
      fetchOrganizationData();
      fetchUserRoles();
    }
  }, [isLoggedIn]); // Theo dõi isLoggedIn

  if (!isInitialLoad) {
    // Hiển thị trạng thái loading khi chưa hoàn thành tải dữ liệu ban đầu
    return <div>Loading...</div>;
  }

  // if (!isLoggedIn) {
  //   // Chuyển hướng nếu chưa đăng nhập
  //   return <Navigate to="/auth/login" replace />;
  // }

  return <Outlet />;
};
