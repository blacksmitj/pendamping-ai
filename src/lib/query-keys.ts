export const queryKeys = {
    // Workspaces
    workspaces: {
        all: ["workspaces"] as const,
        detail: (id: string) => ["workspaces", id] as const,
    },
    // Universities
    universities: {
        all: ["universities"] as const,
        detail: (id: string) => ["universities", id] as const,
    },
    // Users
    users: {
        all: ["users"] as const,
        byRole: (role: string) => ["users", { role }] as const,
    },
    // Participants
    participants: {
        all: ["participants"] as const,
        detail: (id: string) => ["participants", id] as const,
        list: (filters: Record<string, unknown>) => ["participants", filters] as const,
    },
    // Logbooks
    logbooks: {
        all: ["logbooks"] as const,
        detail: (id: string) => ["logbooks", id] as const,
        list: (filters: Record<string, unknown>) => ["logbooks", filters] as const,
    },
    // Outputs
    outputs: {
        all: ["outputs"] as const,
        detail: (id: string) => ["outputs", id] as const,
        list: (filters: Record<string, unknown>) => ["outputs", filters] as const,
    },
    // Dashboard
    dashboard: {
        stats: ["dashboard", "stats"] as const,
        recentLogbooks: ["dashboard", "recent-logbooks"] as const,
        charts: ["dashboard", "charts"] as const,
    },
} as const;
