export const hashPassword = async (password: string): Promise<string> => {
  // パスワードをUint8Arrayに変換
  const encoder = new TextEncoder();
  const data = encoder.encode(password);

  // SHA-256でハッシュ化
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // ArrayBufferを16進数文字列に変換
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join(
    "",
  );

  return hashHex;
};
