import { AccountInfoService } from "common/services/account-info.service";
import { AuthService } from "common/services";
import { logOut } from "redux/slices/user.slice";

let checkInterval = null;

export const ActiveService = {
  startActiveCheck(store) {
    this.stopActiveCheck();

    checkInterval = setInterval(() => {
      this.checkUserActive(store);
    }, 60000);
  },

  stopActiveCheck() {
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
  },

  async checkUserActive(store) {
    // Get the refresh token directly from the store
    const refreshToken = store.getState().user?.refreshToken;
    try {
      const response = await AccountInfoService.checkActiveStatus();
      const userData = response?.data?.data;  

      if (userData && userData.isActive === false) {
        console.log("User is no longer active. Logging out...");

        try {
          await AuthService.logOut(refreshToken);
        } catch (error) {
          console.log("Error during logout:", error);
        } finally {
          // Dispatch logout action
          store.dispatch(logOut());

          // Redirect to login page
          if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
          }
        }
      }
    } catch (error) {
      console.error("Failed to check user active status:", error);

      // Get the refresh token from the store
      const refreshToken = store.getState().user?.refreshToken;

      try {
        // Using AuthService logout method like in the LogOutPage
        await AuthService.logOut(refreshToken);
      } catch (logoutError) {
        console.log("Error during logout:", logoutError);
      } finally {
        // Dispatch logout action
        store.dispatch(logOut());

        // Redirect to login page
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
    }
  },
};
