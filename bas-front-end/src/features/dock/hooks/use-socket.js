import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { UserManagementService } from "common/services";

export const useSocket = (berthId) => {
  // Keep references to each socket (bas, device, ports)
  const socketsRef = useRef({
    bas: null,
    device: null,
    ports: null,
  });

  // Track incoming data and timestamp
  const [socketData, setSocketData] = useState(null);
  const [lastDataTimestamp, setLastDataTimestamp] = useState(Date.now());

  // A ref to detect unmount (avoid setting state on unmounted component)
  const mountedRef = useRef(true);

  // A ref to track if BAS has received data for the first time
  const firstBasDataReceivedRef = useRef(false);

  // A ref to store the baseConfig
  const baseConfigRef = useRef(null);

  /**
   * Initialize a single Socket.IO client with relevant event listeners.
   */
  const createSocket = (url, type, config) => {
    const socket = io(url, config);

    // Once connected, optionally "join" a room for bas/device
    socket.on("connect", () => {
      console.log(`${type} socket connected`);
      if (berthId && (type === "bas" || type === "device")) {
        socket.emit("join", JSON.stringify({ berthId }));
      }
    });

    socket.on("connect_error", (error) => {
      console.error(`${type} socket connection error:`, error);
    });

    // Register event handlers per socket type
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

          if (!firstBasDataReceivedRef.current) {
            firstBasDataReceivedRef.current = true;
            cleanupSocket(socketsRef.current.ports);
            socketsRef.current.ports = createSocket(
              `${process.env.REACT_APP_API_BASE_URL}/port-events`,
              "ports",
              baseConfigRef.current,
            );
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

  /**
   * Helper to cleanly close a socket.
   */
  const cleanupSocket = (socket) => {
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }
  };

  /**
   * Public method: forcibly disconnect all sockets (and clean them up).
   */
  const disconnectSockets = () => {
    const { bas, device, ports } = socketsRef.current;
    cleanupSocket(bas);
    cleanupSocket(device);
    cleanupSocket(ports);
    socketsRef.current.bas = null;
    socketsRef.current.device = null;
    socketsRef.current.ports = null;
  };

  /**
   * Public method: join all relevant "rooms" on the server side,
   * if the sockets are connected.
   */
  const joinDockSockets = (id) => {
    const { bas, device, ports } = socketsRef.current;
    const payload = JSON.stringify({ berthId: id });

    if (bas?.connected) bas.emit("join", payload);
    if (device?.connected) device.emit("join", payload);
    if (ports?.connected) ports.emit("join", payload);
  };

  /**
   * Public method: leave all relevant "rooms."
   */
  const leaveDockSockets = (id) => {
    const { bas, device, ports } = socketsRef.current;
    const payload = JSON.stringify({ berthId: id });

    if (bas?.connected) bas.emit("leave", payload);
    if (device?.connected) device.emit("leave", payload);
    if (ports?.connected) ports.emit("leave", payload);
  };

  /**
   * Public method: pause/resume device socket streaming
   */
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

  /**
   * useEffect: initialize sockets when `berthId` is available,
   * then clean up on unmount or when `berthId` changes.
   */
  useEffect(() => {
    mountedRef.current = true;

    const initSockets = async () => {
      try {
        // Fetch token (if your backend requires auth)
        const resp = await UserManagementService.getSocketAccessToken();
        if (!resp?.data?.success || !mountedRef.current) return;

        // Base socket config
        const accessToken = resp.data.accessToken;
        const baseConfig = {
          extraHeaders: { authorization: accessToken },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        };

        // Store the baseConfig in a ref
        baseConfigRef.current = baseConfig;

        // Initialize all sockets
        socketsRef.current.bas = createSocket(
          `${process.env.REACT_APP_API_BASE_URL}/bas-realtime`,
          "bas",
          baseConfig,
        );

        // Device can have additional query param
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

    // Cleanup when unmounting or berthId changes
    return () => {
      mountedRef.current = false;
      disconnectSockets();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [berthId]);

  // Return an object with the sockets and public methods
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
