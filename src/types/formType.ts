import { Prisma } from "@prisma/client"

export type FormWithQuestions = Prisma.FormGetPayload<{ include: { questions: true } }>;