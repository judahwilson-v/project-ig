import { defaultUser } from "@/lib/data/mock-data";
import type { RemittanceSimulationInput, UserProfile } from "@/lib/types/domain";
import { z } from "zod";

const interactionSchema = z.object({
  targetId: z.string(),
  kind: z.enum(["interested", "ignored", "saved", "shared", "explained"]),
  createdAt: z.string().optional()
});

export const userProfileInputSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    skillProfile: z.array(z.string()).optional(),
    preferredCountries: z.array(z.string()).optional(),
    careerInterest: z.array(z.string()).optional(),
    interactionHistory: z.array(interactionSchema).optional()
  })
  .partial();

export const explainerInputSchema = z.object({
  label: z.string().min(2),
  value: z.string().min(1),
  context: z.string().optional(),
  sourceHash: z.string().optional()
});

export const expressInterestInputSchema = z.object({
  userId: z.string().min(1).default(defaultUser.id),
  careerId: z.string().min(1),
  note: z.string().max(240).optional()
});

export const skillsAnalyzeInputSchema = z.object({
  user: userProfileInputSchema.optional(),
  targetSector: z.string().optional()
});

export const remittanceSimulationInputSchema = z.object({
  monthlyRemittance: z.number().nonnegative(),
  dependenceRatio: z.number().min(0).max(100),
  householdMembers: z.number().int().min(1).max(20)
});

export function mergeUserProfile(input?: z.infer<typeof userProfileInputSchema>): UserProfile {
  return {
    ...defaultUser,
    ...input,
    skillProfile: input?.skillProfile ?? defaultUser.skillProfile,
    preferredCountries: input?.preferredCountries ?? defaultUser.preferredCountries,
    careerInterest: input?.careerInterest ?? defaultUser.careerInterest,
    interactionHistory: input?.interactionHistory ?? defaultUser.interactionHistory
  };
}

export function buildDefaultRemittanceInput(): RemittanceSimulationInput {
  return {
    monthlyRemittance: 45000,
    dependenceRatio: 62,
    householdMembers: 4
  };
}
