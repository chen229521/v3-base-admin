export interface RequestInstanceState {
  refreshTokenFn: Promise<boolean> | null;
  errMsgStack: string[];
}
