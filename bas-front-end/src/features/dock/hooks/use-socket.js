import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { UserManagementService } from "common/services";

export const useSocket = (berthId) => {
  const socketsRef = useRef({
    bas: null,
    device: null,
    ports: null,
  });

  const [socketData, setSocketData] = useState(null);
  const [lastDataTimestamp, setLastDataTimestamp] = useState(Date.now());

  const mountedRef = useRef(true);

  const baseConfigRef = useRef(null);

  const createSocket = (url, type, config) => {
    const socket = io(url, config);

    socket.on("connect", () => {
      console.log(`${type} socket connected`);
      if (
        berthId &&
        (type === "bas" || type === "device" || type === "ports")
      ) {
        socket.emit("join", JSON.stringify({ berthId }));
      }
    });

    socket.on("connect_error", (error) => {
      console.error(`${type} socket connection error:`, error);
    });

    if (type === "device") {
      socket.on("device", (data) => {
        if (mountedRef.current) {
          setSocketData(JSON.parse(data));
          setLastDataTimestamp(Date.now());
        }
      });
    } else if (type === "bas") {
      socket.on("data", (data) => {
        if (mountedRef.current) {
          setLastDataTimestamp(Date.now());
          const parsedData = JSON.parse(data);
          setSocketData((prev) => ({ ...prev, ...parsedData }));
        }
      });

      socket.on("error", (error) => {
        console.error("BAS socket error:", error);
      });
    } else if (type === "ports") {
      socket.on("port_event", (data) => {
        if (mountedRef.current) {
          const parsedData = JSON.parse(data);
          setSocketData((prev) => ({ ...prev, portEvent: parsedData }));
          setLastDataTimestamp(Date.now());
        }
      });

      socket.on("error", (error) => {
        console.error("Ports socket error:", error);
      });
    }

    return socket;
  };

  const cleanupSocket = (socket) => {
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }
  };

  const disconnectSockets = () => {
    const { bas, device, ports } = socketsRef.current;
    cleanupSocket(bas);
    cleanupSocket(device);
    cleanupSocket(ports);
    socketsRef.current.bas = null;
    socketsRef.current.device = null;
    socketsRef.current.ports = null;
  };

  const joinDockSockets = (id) => {
    const { bas, device, ports } = socketsRef.current;
    const payload = JSON.stringify({ berthId: id });

    if (bas?.connected) bas.emit("join", payload);
    if (device?.connected) device.emit("join", payload);
    if (ports?.connected) ports.emit("join", payload);
  };

  const leaveDockSockets = (id) => {
    const { bas, device, ports } = socketsRef.current;
    const payload = JSON.stringify({ berthId: id });

    if (bas?.connected) bas.emit("leave", payload);
    if (device?.connected) device.emit("leave", payload);
    if (ports?.connected) ports.emit("leave", payload);
  };

  const pauseDeviceData = () => {
    const { device } = socketsRef.current;
    if (device?.connected) {
      device.emit("pause", JSON.stringify({ berthId }));
      console.log("Paused device data streaming");
    }
  };

  const resumeDeviceData = () => {
    const { device } = socketsRef.current;
    if (device?.connected) {
      device.emit("resume", JSON.stringify({ berthId }));
      console.log("Resumed device data streaming");
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    const initSockets = async () => {
      try {
        const resp = await UserManagementService.getSocketAccessToken();
        if (!resp?.data?.success || !mountedRef.current) return;

        const accessToken = resp.data.accessToken;
        const baseConfig = {
          extraHeaders: { authorization: accessToken },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        };

        baseConfigRef.current = baseConfig;

        socketsRef.current.bas = createSocket(
          `${process.env.REACT_APP_API_BASE_URL}/bas-realtime`,
          "bas",
          baseConfig,
        );

        socketsRef.current.device = createSocket(
          `${process.env.REACT_APP_API_BASE_URL}/device-realtime`,
          "device",
          { ...baseConfig, query: { berthId } },
        );

        socketsRef.current.ports = createSocket(
          `${process.env.REACT_APP_API_BASE_URL}/port-events`,
          "ports",
          baseConfig,
        );
      } catch (error) {
        console.error("Socket initialization error:", error);
      }
    };

    if (berthId) {
      initSockets();
    }

    return () => {
      mountedRef.current = false;
      disconnectSockets();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [berthId]);

  return {
    basSocket: socketsRef.current.bas,
    deviceSocket: socketsRef.current.device,
    portsSocket: socketsRef.current.ports,
    socketData,
    lastDataTimestamp,
    joinDockSockets,
    leaveDockSockets,
    disconnectSockets,
    pauseDeviceData,
    resumeDeviceData,
  };
};
