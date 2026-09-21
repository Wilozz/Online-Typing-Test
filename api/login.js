import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" })
    }

    const sql = neon(process.env.DATABASE_URL)

    const users = await sql`SELECT id, email, password_hash FROM users WHERE email = ${email}`

    if (users.length === 0) {
        return res.stauts(401).json({ error: "Invalid email or password" })
    }

    const user = users[0]

    const passwordMatches = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatches) {
        return res.status(401).json({ error: "Invalid email or password" })
    }

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    )

    res.status(200).json({ token, user: { id: user.id, email: user.email }})
}