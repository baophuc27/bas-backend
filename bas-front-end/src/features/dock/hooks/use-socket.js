import { useEffect, useState } from 'react';
import socketIOClient from "socket.io-client";
import { UserManagementService } from "common/services";

export const useSocket = (berthId) => {
  const [sockets, setSockets] = useState({
    basSocket: null,
    deviceSocket: null,
    portsSocket: null
  });
  const [socketData, setSocketData] = useState(null);
  const [lastDataTimestamp, setLastDataTimestamp] = useState(Date.now());

  const cleanupSocket = (socket, eventName = null, data = null) => {
    if (socket) {
      if (eventName && data) {
        socket.emit('leave', JSON.stringify(data));
      }
      socket.off('connect');
      if (eventName) {
        socket.off(eventName);
      }
      socket.removeAllListeners();
      socket.disconnect();
      socket.close();
    }
  };

  const joinDockSockets = (id) => {
    if (sockets?.deviceSocket && sockets?.deviceSocket.connected) {
      sockets.deviceSocket.emit('join', JSON.stringify({ berthId: id }));
    }
    if (sockets?.basSocket && sockets?.basSocket.connected) {
      // any needed join for basSocket
    }
    if (sockets?.portsSocket && sockets?.portsSocket.connected) {
      // any needed join for portsSocket
    }
  };

  const leaveDockSockets = (id) => {
    if (sockets?.deviceSocket) {
      cleanupSocket(sockets.deviceSocket, 'device', { berthId: id });
    }
    if (sockets?.basSocket) {
      cleanupSocket(sockets.basSocket);
    }
    if (sockets?.portsSocket) {
      cleanupSocket(sockets.portsSocket);
    }
  };

  useEffect(() => {
    let mounted = true;
    let dataCheckInterval;

    const initializeSockets = async () => {
      try {
        const resp = await UserManagementService.getSocketAccessToken();
        if (!resp?.data?.success || !mounted) return;

        const socketConfig = {
          extraHeaders: {
            authorization: resp.data?.accessToken,
          },
        };

        const basSocket = socketIOClient.io(
          `${process.env.REACT_APP_API_BASE_URL}/bas-realtime`,
          socketConfig
        );

        // Add data reception monitor for basSocket
        basSocket.on('data', () => {
          if (mounted) {
            setLastDataTimestamp(Date.now());
          }
        });

        const deviceSocket = socketIOClient.io(
          `${process.env.REACT_APP_API_BASE_URL}/device-realtime`,
          {
            ...socketConfig,
            query: { berthId },
          }
        );

        const portsSocket = socketIOClient.io(
          `${process.env.REACT_APP_API_BASE_URL}/port-events`,
          socketConfig
        );

        if (mounted) {
          setSockets({ basSocket, deviceSocket, portsSocket });

          deviceSocket.on('connect', () => {
            deviceSocket.emit('join', JSON.stringify({ berthId }));
          });

          deviceSocket.on('device', (data) => {
            if (mounted) {
              setSocketData(JSON.parse(data));
            }
          });

          // Start monitoring data reception
          dataCheckInterval = setInterval(() => {
            const timeSinceLastData = Date.now() - lastDataTimestamp;
            if (timeSinceLastData > 10000) { // 10 seconds threshold
              basSocket.emit('check_connection');
            }
          }, 5000);
        }
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    };

    if (berthId) {
      initializeSockets();
    }

    return () => {
      mounted = false;
      if (dataCheckInterval) {
        clearInterval(dataCheckInterval);
      }
      leaveDockSockets(berthId);
      setSockets({
        basSocket: null,
        deviceSocket: null,
        portsSocket: null
      });
    };
  }, [berthId, lastDataTimestamp]);

  return {
    ...sockets,
    socketData,
    joinDockSockets,
    leaveDockSockets,
    lastDataTimestamp
  };
};
