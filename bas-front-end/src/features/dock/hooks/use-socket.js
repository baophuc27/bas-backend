import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { UserManagementService } from "common/services";

export const useSocket = (berthId) => {
  const socketsRef = useRef({
    bas: null,
    device: null,
    ports: null,
  });

  const timeoutRef = useRef(null);
  const hasReceivedFirstBasMessage = useRef(false);

  const [socketData, setSocketData] = useState(null);
  const [lastDataTimestamp, setLastDataTimestamp] = useState(Date.now());

  const mountedRef = useRef(true);

  const baseConfigRef = useRef(null);

  const joinPayload = (id) => JSON.stringify({ berthId: id });

  const recreatePortsSocket = () => {
    if (socketsRef.current.ports) {
      cleanupSocket(socketsRef.current.ports);
    }
    if (baseConfigRef.current && mountedRef.current) {
      socketsRef.current.ports = createSocket(
        `${process.env.REACT_APP_API_BASE_URL}/port-events`,
        "ports",
        baseConfigRef.current,
      );
    }
  };

  const handleBasTimeout = () => {
    if (mountedRef.current) {
      console.log("BAS socket timeout - recreating ports socket");
      recreatePortsSocket();
    }
  };

  const createSocket = (url, type, config) => {
    const socket = io(url, config);

    socket.on("connect", () => {
      socket.emit("join", JSON.stringify({ berthId }));
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
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }

          timeoutRef.current = setTimeout(handleBasTimeout, 5000);

          setLastDataTimestamp(Date.now());
          const parsedData = JSON.parse(data);
          setSocketData((prev) => ({ ...prev, ...parsedData }));

          if (!hasReceivedFirstBasMessage.current) {
            hasReceivedFirstBasMessage.current = true;
            recreatePortsSocket();
          }
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
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const { bas, device, ports } = socketsRef.current;
    cleanupSocket(bas);
    cleanupSocket(device);
    cleanupSocket(ports);
    socketsRef.current.bas = null;
    socketsRef.current.device = null;
    socketsRef.current.ports = null;
  };

const joinDockSockets = (id, socketType) => {
  const { bas, device, ports } = socketsRef.current;
  const payload = joinPayload(id);

  switch (socketType) {
    case "bas":
      if (bas?.connected) bas.emit("join", payload);
      break;
    case "device":
      if (device?.connected) device.emit("join", payload);
      break;
    case "ports":
      if (ports?.connected) ports.emit("join", payload);
      break;
    default:
      console.warn(`Unknown socket type: ${socketType}`);
  }
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

  const pauseBasData = () => {
    const { bas } = socketsRef.current;
    if (bas?.connected) {
      bas.emit("pause", JSON.stringify({ berthId }));
      console.log("Paused bas data streaming");
    }
  };

  const resumeBasData = () => {
    const { bas } = socketsRef.current;
    if (bas?.connected) {
      bas.emit("resume", JSON.stringify({ berthId }));
      console.log("Resumed bas data streaming");
    }
  };

  const pausePortsData = () => {
    const { ports } = socketsRef.current;
    if (ports?.connected) {
      ports.emit("pause", JSON.stringify({ berthId }));
      console.log("Paused ports data streaming");
    }
  };

  const resumePortsData = () => {
    const { ports } = socketsRef.current;
    if (ports?.connected) {
      ports.emit("resume", JSON.stringify({ berthId }));
      console.log("Resumed ports data streaming");
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    hasReceivedFirstBasMessage.current = false;

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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
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
    pauseBasData,
    resumeBasData,
    pausePortsData,
    resumePortsData,
  };
};
