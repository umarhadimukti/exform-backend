import { Prisma } from "@prisma/client";

export type FormWithQuestions = Prisma.FormGetPayload<{ include: { questions: true } }>;

export type FormSeeder = {
    user_id: number,
    title: string,
    description?: string | null,
    is_public: boolean,
    invites?: string[],
};