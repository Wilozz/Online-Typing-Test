import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" })
    }

    const sql = neon(process.env.DATABASE_URL)

    const existing = await sql`SELECT id FROM users WHERE email = ${email}`
    if (existing.length > 0) {
        return res.status(409).json({ error: "Email already registered" })
    }

    // 10 salt rounds (conventional default value)
    const passwordHash = await bcrypt.hash(password, 10)

    const result = await sql`
    INSERT INTO users (email, password_hash)
    VALUES (${email}, ${passwordHash}) 
    RETURNING id, email, created_at
    `

    res.status(201).json({ user: result[0] })
}

