import jwt from "jsonwebtoken"

export function requireAuth(req) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return { error: "No token provided" }
    }

    const token = authHeader.split(" ")[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        return { userId: decoded.userId }
    } catch (err) {
        return { error: "Invalid or expired token" }
    }
}