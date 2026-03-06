import { getParticipantById } from "@/actions/participants"
import ParticipantDetailClient from "./client"

export default async function ParticipantDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const participant = await getParticipantById(id)

    if (!participant) {
        return <div className="p-8 text-center text-slate-500">Participant not found.</div>
    }

    return <ParticipantDetailClient participant={participant} id={id} />
}
