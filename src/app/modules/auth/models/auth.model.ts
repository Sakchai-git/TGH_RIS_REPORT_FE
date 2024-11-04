export class AuthModel {
  authToken: string;
  refreshToken: string;
  expiresIn: Date;
  accessToken:string;

  setAuth(auth: AuthModel) {
    this.authToken = auth.authToken;
    this.refreshToken = auth.refreshToken;
    this.expiresIn = auth.expiresIn;
    this.accessToken = auth.accessToken;
  }
}
