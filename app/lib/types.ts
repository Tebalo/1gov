export type AuthenticateResult =
  | { status: 'success' }
  | { status: 'failed'; message: string };