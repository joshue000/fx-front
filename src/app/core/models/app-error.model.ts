export type AppErrorKind = 'network' | 'api';

export interface AppError {
  kind: AppErrorKind;
  message: string;
}
