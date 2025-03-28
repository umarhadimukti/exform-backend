import { z } from "zod";

export type InvitesSchemaType = {
    invited_users?: string[] | undefined,
}

export const invitesSchema = z.object({
    invited_users: z.array(
        z.string().email({ message: 'invalid email address' })
    ).optional(),
});