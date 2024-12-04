import { HabourService } from "common/services";
import { BerthService } from "common/services/berth.service";
import { CommonService } from "common/services/common.service";
import { UserManagementService } from "common/services/user-management.service";
import { useEffect, useState } from "react";
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

  const [loading, setLoading] = useState(false); // Add loading state

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const [
        organizationResponse,
        habourResponse,
        berthStatusesResponse,
        userRolesResponse,
        berthsResponse,
      ] = await Promise.all([
        CommonService.getOrganizationData(),
        HabourService.getData(),
        BerthService.getStatuses(),
        UserManagementService.getAllRoles(),
        BerthService.getAll(),
      ]);

      // Dispatch the data if successful
      if (organizationResponse?.data?.success) {
        dispatch(setOrganizationData(organizationResponse?.data?.data));
      }
      if (habourResponse?.data?.success) {
        dispatch(setHabourData(habourResponse?.data?.data));
      }
      if (berthStatusesResponse?.data?.success) {
        dispatch(setBerthStatuses(berthStatusesResponse?.data?.data));
      }
      if (userRolesResponse?.data?.success) {
        dispatch(setUserRoles(userRolesResponse?.data?.data));
      }
      if (berthsResponse?.data?.success) {
        dispatch(setBerths(berthsResponse?.data?.data));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData(); // Fetch all necessary data when the user is logged in
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]); // Trigger effect when login status changes

  return (
    <>
      {loading ? (
        <div>Loading...</div> // Display loading indicator
      ) : (
        <Outlet />
      )}
    </>
  );
};
