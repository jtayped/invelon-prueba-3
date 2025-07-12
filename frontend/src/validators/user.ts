import z from "zod";

export const userSchema = z.object({
  name: z.string(),
  email: z.string(),
  affiliate: z.boolean(),
  preferences: z.string().array(),
});

export type UserType = z.infer<typeof userSchema>;
