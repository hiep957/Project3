import jwt, { VerifyErrors } from "jsonwebtoken";

export const verifyRefreshToken = async function (
  refreshToken: any
): Promise<any> {
  return new Promise(function (resolve, reject) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string,
      (err: VerifyErrors | null, payload: any) => {
        if (err) {
          return reject(err);
        }

        const userId = payload.aud;
        console.log("payload", payload);
        return resolve(userId);
      }
    );
  });
};


export default verifyRefreshToken;