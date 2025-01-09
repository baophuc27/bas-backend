import { useEffect, useState, useRef } from "react";
import socketIOClient from "socket.io-client";
import { UserManagementService } from "common/services";

export const useSocket = (berthId) => {
  const [sockets, setSockets] = useState({
    basSocket: null,
    deviceSocket: null,
    portsSocket: null,
  });
  const [socketData, setSocketData] = useState(null);
  const [lastDataTimestamp, setLastDataTimestamp] = useState(Date.now());
  const [isListening, setIsListening] = useState(true);

  // Tạo cờ mounted để kiểm soát trong toàn hook
  const mountedRef = useRef(true);

  const cleanupSocket = (socket, eventName = null, data = null) => {
    if (socket) {
      if (eventName && data) {
        socket.emit("leave", JSON.stringify(data));
      }
      socket.off("connect");
      if (eventName) {
        socket.off(eventName);
      }
      socket.removeAllListeners();
      socket.disconnect();
      socket.close();
    }
  };

  const joinDockSockets = (id) => {
    if (sockets?.deviceSocket && sockets.deviceSocket.connected) {
      sockets.deviceSocket.emit("join", JSON.stringify({ berthId: id }));
    }
    if (sockets?.basSocket && sockets.basSocket.connected) {
      // ...
    }
    if (sockets?.portsSocket && sockets.portsSocket.connected) {
      // ...
    }
  };

  const leaveDockSockets = (id) => {
    if (sockets?.deviceSocket) {
      cleanupSocket(sockets.deviceSocket, "device", { berthId: id });
    }
    if (sockets?.basSocket) {
      cleanupSocket(sockets.basSocket);
    }
    if (sockets?.portsSocket) {
      cleanupSocket(sockets.portsSocket);
    }
  };

  const pauseDeviceData = () => {
    if (sockets?.deviceSocket) {
      sockets.deviceSocket.off("device");
      setIsListening(false);
    }
  };

  const resumeDeviceData = () => {
    if (sockets?.deviceSocket) {
      // Bắt sự kiện device
      sockets.deviceSocket.on("device", (data) => {
        if (mountedRef.current) {
          setSocketData(JSON.parse(data));
          setLastDataTimestamp(Date.now());
        }
      });
      setIsListening(true);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    let dataCheckInterval;

    const initializeSockets = async () => {
      try {
        const resp = await UserManagementService.getSocketAccessToken();
        if (!resp?.data?.success || !mountedRef.current) return;

        const socketConfig = {
          extraHeaders: {
            authorization: resp.data?.accessToken,
          },
        };

        // Tạo basSocket
        const basSocket = socketIOClient.io(
          `${process.env.REACT_APP_API_BASE_URL}/bas-realtime`,
          socketConfig,
        );
        basSocket.on("connect", () => {
          console.log("BAS socket connected");
        });
        basSocket.on("disconnect", () => {
          console.log("BAS socket disconnected");
        });
        // Ghi nhận thời gian nhận data
        basSocket.on("data", () => {
          if (mountedRef.current) {
            setLastDataTimestamp(Date.now());
          }
        });

        // Tạo deviceSocket
        const deviceSocket = socketIOClient.io(
          `${process.env.REACT_APP_API_BASE_URL}/device-realtime`,
          {
            ...socketConfig,
            query: { berthId },
          },
        );
        deviceSocket.on("connect", () => {
          console.log("Device socket connected");
          deviceSocket.emit("join", JSON.stringify({ berthId }));
        });
        if (isListening) {
          deviceSocket.on("device", (data) => {
            if (mountedRef.current) {
              setSocketData(JSON.parse(data));
              setLastDataTimestamp(Date.now());
            }
          });
        }

        // Tạo portsSocket
        const portsSocket = socketIOClient.io(
          `${process.env.REACT_APP_API_BASE_URL}/port-events`,
          socketConfig,
        );

        if (mountedRef.current) {
          setSockets({ basSocket, deviceSocket, portsSocket });

          // Nếu vẫn muốn “ping” server để check “no data” ở đây
          // thì giữ lại dataCheckInterval, còn không thì bỏ đi
          dataCheckInterval = setInterval(() => {
            const timeSinceLastData = Date.now() - lastDataTimestamp;
            if (timeSinceLastData > 10000) {
              // Ở đây chỉ emit lên server,
              // còn phần cảnh báo SweetAlert đã được
              // DockVisualizationPage xử lý
              basSocket.emit("check_connection");
            }
          }, 5000);
        }
      } catch (error) {
        console.error("Socket initialization error:", error);
      }
    };

    if (berthId) {
      initializeSockets();
    }

    return () => {
      mountedRef.current = false;
      if (dataCheckInterval) clearInterval(dataCheckInterval);
      leaveDockSockets(berthId);
      setSockets({
        basSocket: null,
        deviceSocket: null,
        portsSocket: null,
      });
    };
  }, [berthId, isListening, lastDataTimestamp]);

  return {
    ...sockets,
    socketData,
    joinDockSockets,
    leaveDockSockets,
    lastDataTimestamp,
    pauseDeviceData,
    resumeDeviceData,
  };
};
