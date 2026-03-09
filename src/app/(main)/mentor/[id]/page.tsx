import { headers } from "next/headers"
import MentorDetailClient from "./client"

export default async function MentorDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/users/${id}`, {
        headers: await headers()
    })

    if (!res.ok) {
        return <div className="p-8 text-center text-slate-500">Mentor not found.</div>
    }

    const mentor = await res.json()

    return <MentorDetailClient mentor={mentor} />
}
