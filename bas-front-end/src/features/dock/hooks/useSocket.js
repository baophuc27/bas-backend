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

  useEffect(() => {
    let mounted = true;

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
      if (sockets.deviceSocket) {
        cleanupSocket(sockets.deviceSocket, 'device', { berthId });
      }
      if (sockets.basSocket) {
        cleanupSocket(sockets.basSocket);
      }
      if (sockets.portsSocket) {
        cleanupSocket(sockets.portsSocket);
      }
      setSockets({
        basSocket: null,
        deviceSocket: null,
        portsSocket: null
      });
    };
  }, [berthId]);

  return { ...sockets, socketData };
};
