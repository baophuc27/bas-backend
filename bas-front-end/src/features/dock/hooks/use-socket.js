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

  const setupSocketEvents = (socket, type) => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log(`${type} socket connected`);
      if (type === 'device' && berthId) {
        socket.emit("join", JSON.stringify({ berthId }));
      }
    });

    socket.on("disconnect", () => {
      console.log(`${type} socket disconnected`);
    });

    socket.on("connect_error", (error) => {
      console.error(`${type} socket connection error:`, error);
    });

    if (type === 'device' && isListening) {
      socket.on("device", (data) => {
        if (mountedRef.current) {
          setSocketData(JSON.parse(data));
          setLastDataTimestamp(Date.now());
        }
      });
    }

    if (type === 'bas') {
      socket.on("data", () => {
        if (mountedRef.current) {
          setLastDataTimestamp(Date.now());
        }
      });
    }
  };

  const initializeSocket = async (url, type, config = {}) => {
    try {
      const socket = socketIOClient.io(url, config);
      setupSocketEvents(socket, type);
      return socket;
    } catch (error) {
      console.error(`Failed to initialize ${type} socket:`, error);
      return null;
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
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        };

        const basSocket = await initializeSocket(
          `${process.env.REACT_APP_API_BASE_URL}/bas-realtime`,
          'bas',
          socketConfig
        );

        const deviceSocket = await initializeSocket(
          `${process.env.REACT_APP_API_BASE_URL}/device-realtime`,
          'device',
          { ...socketConfig, query: { berthId } }
        );

        const portsSocket = await initializeSocket(
          `${process.env.REACT_APP_API_BASE_URL}/port-events`,
          'ports',
          socketConfig
        );

        if (mountedRef.current) {
          setSockets({ basSocket, deviceSocket, portsSocket });
          
          dataCheckInterval = setInterval(() => {
            const timeSinceLastData = Date.now() - lastDataTimestamp;
            if (timeSinceLastData > 10000 && basSocket?.connected) {
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
      if (dataCheckInterval) {
        clearInterval(dataCheckInterval);
      }
      leaveDockSockets(berthId);
      setSockets({
        basSocket: null,
        deviceSocket: null,
        portsSocket: null,
      });
    };
  }, [berthId]);

  // Move device event handling to a separate effect
  useEffect(() => {
    const { deviceSocket } = sockets;
    if (deviceSocket) {
      if (isListening) {
        deviceSocket.on("device", (data) => {
          if (mountedRef.current) {
            setSocketData(JSON.parse(data));
            setLastDataTimestamp(Date.now());
          }
        });
      } else {
        deviceSocket.off("device");
      }
    }
    
    return () => {
      if (deviceSocket) {
        deviceSocket.off("device");
      }
    };
  }, [sockets.deviceSocket, isListening]);

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
