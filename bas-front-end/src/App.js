import { PageLoader } from "common/components";
import { Suspense, useEffect } from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "redux/store";
import { setupAuthAxiosClient } from "setup/axios/auth.axios";
import { router } from "setup/router";
import { ActiveService } from "services/active.service";

// Notes: <Provider /> must be the root component to prevent strange redux behaviour
const App = (props) => {
  setupAuthAxiosClient(store);

  useEffect(() => {
    // Start checking user active status when app initializes
    ActiveService.startActiveCheck(store);

    // Clean up interval when app unmounts
    return () => {
      ActiveService.stopActiveCheck();
    };
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={router} />
          <ToastContainer
            containerId="standard-toast"
            position="top-right"
            enableMultiContainer
          />
          {/* <div style={{ height: "100vh", backgroundColor: "#f5f5f5" }}>
            <SwaggerUI url="http://localhost:8008/api-docs/swagger.json" />
          </div> */}
        </Suspense>
      </PersistGate>
    </Provider>
  );
};

export default App;
