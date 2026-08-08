export interface JWTPayload {
  sub: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = 'coderush_secret_jwt_key_2026_offiicialcoderush2026';

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binString = '';
  for (let i = 0; i < bytes.length; i++) {
    binString += String.fromCharCode(bytes[i]);
  }
  return btoa(binString)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binString = atob(base64);
  const bytes = new Uint8Array(binString.length);
  for (let i = 0; i < binString.length; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Digitally signs a JWT token using HMAC SHA-256 with Web Crypto API.
 */
export async function signJWT(payload: JWTPayload, secret = JWT_SECRET): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(dataToSign));
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  let binString = '';
  for (let i = 0; i < signatureArray.length; i++) {
    binString += String.fromCharCode(signatureArray[i]);
  }
  const signatureBase64 = btoa(binString)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${dataToSign}.${signatureBase64}`;
}

/**
 * Cryptographically verifies a JWT token signature and expiration.
 */
export async function verifyJWT(token: string, secret = JWT_SECRET): Promise<JWTPayload | null> {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    let base64Sig = signature.replace(/-/g, '+').replace(/_/g, '/');
    while (base64Sig.length % 4) base64Sig += '=';
    const sigStr = atob(base64Sig);
    const sigBuffer = new Uint8Array(sigStr.length);
    for (let i = 0; i < sigStr.length; i++) {
      sigBuffer[i] = sigStr.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify('HMAC', cryptoKey, sigBuffer, encoder.encode(dataToSign));
    if (!isValid) return null;

    const payloadJSON = base64UrlDecode(encodedPayload);
    const payload = JSON.parse(payloadJSON) as JWTPayload;

    const nowInSec = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < nowInSec) {
      return null;
    }

    return payload;
  } catch (err) {
    console.warn('JWT Verification error:', err);
    return null;
  }
}
