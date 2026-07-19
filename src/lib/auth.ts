import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "hellofood-dev-secret";

export interface AdminPayload {
  id: string;
  username: string;
}

export function signToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}
