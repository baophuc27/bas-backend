import { HabourService } from "common/services";
import { BerthService } from "common/services/berth.service";
import { CommonService } from "common/services/common.service";
import { UserManagementService } from "common/services/user-management.service";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import {
  setBerths,
  setBerthStatuses,
  setUserRoles,
} from "redux/slices/enumeration.slice";
import { setHabourData } from "redux/slices/habour.slice";
import { setOrganizationData } from "redux/slices/organization.slice";

const MAX_RETRIES = 3;
const TIMEOUT_DURATION = 5000;

export const AppContainer = (props) => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state?.user);

  const [loading, setLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const abortControllerRef = useRef(null);

  const spinnerStyle = {
    width: "40px",
    height: "40px",
    border: "4px solid #ccc",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  };

  const fetchWithTimeout = async (promise) => {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), TIMEOUT_DURATION);
    });
    return Promise.race([promise, timeoutPromise]);
  };

  const fetchData = async () => {
    if (retryCount >= MAX_RETRIES) {
      setErrorMessage('Maximum retry attempts reached. Please refresh the page.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    
    abortControllerRef.current = new AbortController();
    
    try {
      const promises = [
        CommonService.getOrganizationData(abortControllerRef.current.signal),
        HabourService.getData(abortControllerRef.current.signal),
        BerthService.getStatuses(abortControllerRef.current.signal),
        UserManagementService.getAllRoles(abortControllerRef.current.signal),
        BerthService.getAll(abortControllerRef.current.signal),
      ];

      const responses = await fetchWithTimeout(Promise.all(promises));
      
      const [org, harbour, berthStatuses, userRoles, berths] = responses;
      
      if (org?.data?.success) dispatch(setOrganizationData(org.data.data));
      if (harbour?.data?.success) dispatch(setHabourData(harbour.data.data));
      if (berthStatuses?.data?.success) dispatch(setBerthStatuses(berthStatuses.data.data));
      if (userRoles?.data?.success) dispatch(setUserRoles(userRoles.data.data));
      if (berths?.data?.success) dispatch(setBerths(berths.data.data));

      setRetryCount(0);
      
    } catch (error) {
      if (error.name === 'AbortError') return;
      
      console.error("Error fetching data:", error);
      setErrorMessage(error.message || 'Failed to load data');
      setRetryCount(prev => prev + 1);
      
      // Retry after 2 seconds
      setTimeout(() => {
        fetchData();
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return (
    <>
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
          <div style={spinnerStyle}></div>
          <span style={{ marginLeft: "12px" }}>Loading{'.'.repeat(retryCount + 1)}</span>
          {errorMessage && (
            <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>
          )}
          {retryCount > 0 && (
            <div style={{ marginTop: '5px' }}>
              Retry attempt {retryCount} of {MAX_RETRIES}
            </div>
          )}
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
};
