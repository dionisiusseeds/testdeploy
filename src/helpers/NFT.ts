import * as crypto from 'crypto';

const base62Chars =
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function toBase62(num: number): string {
  let result = '';
  while (num > 0) {
    result = base62Chars[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result ?? '0';
}

export const generateAssetCode = ({
  publicKey
}: {
  publicKey: string;
}): string => {
  const hashBuffer: Buffer = crypto
    .createHash('sha256')
    .update(Date.now().toString() + publicKey)
    .digest();
  const num: number = parseInt(hashBuffer.subarray(0, 6).toString('hex'), 16);
  const num2: number = parseInt(
    hashBuffer.subarray(26, 32).toString('hex'),
    16
  );

  const assetCode: string = (toBase62(num) + toBase62(num2)).substring(0, 12);

  return assetCode;
};
