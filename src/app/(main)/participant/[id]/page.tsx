import { headers } from "next/headers"
import ParticipantDetailClient from "./client"

export default async function ParticipantDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    // Fetch from API route
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/participants/${id}`, {
        headers: await headers()
    })

    if (!res.ok) {
        return <div className="p-8 text-center text-slate-500">Participant not found.</div>
    }

    const participant = await res.json()

    return <ParticipantDetailClient participant={participant} id={id} />
}
