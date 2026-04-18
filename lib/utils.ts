/** Generates a unique id for new tasks (RFC 4122 UUID via Web Crypto). */
export function createTaskId(): string {
  return crypto.randomUUID();
}
