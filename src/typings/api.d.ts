declare namespace Api {
  namespace Auth {
    interface UserInfo {
      userId: string;
      userName: string;
      roles: string[];
      buttons: string[];
    }

    interface LoginToken {
      token: string;
      refreshToken: string;
    }
  }
}
