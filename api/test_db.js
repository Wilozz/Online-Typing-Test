import { neon } from "@neondatabase/serverless";

export default async function handler(req, res) {
    const sql = neon(process.env.DATABASE_URL)
    const result = await sql`SELECT NOW()`
    res.status(200).json(result)
}