
export interface DecodedToken {
  userId: string;
  roleId: number;
  orgId: number;
  exp: number;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    const base64Payload = actualToken.split('.')[1];
    if (!base64Payload) return null;
    
    const payload = Buffer.from(base64Payload, 'base64').toString('utf8');
    return JSON.parse(payload);
  } catch (error) {
    console.error('[decodeToken] Error decoding token:', error);
    return null;
  }
};