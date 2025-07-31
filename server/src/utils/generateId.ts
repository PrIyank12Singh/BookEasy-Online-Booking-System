import { randomBytes } from "crypto"

export function generateId(): string {
  return randomBytes(8).toString("hex") // generates a 16-character hex string
}
