import { z } from 'zod'

export const SearchQuerySchema = z.object({
  suburb:       z.string().min(1).optional(),
  transmission: z.enum(['auto','manual','both']).optional(),
  max_price:    z.coerce.number().optional(),
  anxiety:      z.coerce.boolean().optional(),
  intl:         z.coerce.boolean().optional(),
  sort:         z.enum(['relevance','price_asc','rating','newest']).default('relevance'),
  page:         z.coerce.number().default(1),
})

export const ReviewSubmitSchema = z.object({
  instructor_id:        z.string().uuid(),
  reviewer_name:        z.string().min(2).max(50),
  reviewer_email:       z.string().email(),
  rating_overall:       z.number().int().min(1).max(5),
  rating_patience:      z.number().int().min(1).max(5),
  rating_communication: z.number().int().min(1).max(5),
  rating_value:         z.number().int().min(1).max(5),
  rating_punctuality:   z.number().int().min(1).max(5),
  pass_outcome:         z.enum(['passed_first','passed_retry','still_learning','not_tested']),
  review_text:          z.string().max(1000).optional(),
})

export const BioRequestSchema = z.object({
  years_experience: z.coerce.number().int().min(0).max(50),
  licence_types:    z.array(z.string()),
  teaching_style:   z.string().min(3).max(100),
  learner_types:    z.string().min(3).max(200),
  proud_of:         z.string().min(3).max(200),
  specialisations:  z.string().max(200).optional(),
})

export const MatchRequestSchema = z.object({
  suburb:          z.string().min(2),
  transmission:    z.enum(['auto','manual','both']),
  special_needs:   z.array(z.string()),
  available_days:  z.array(z.string()),
  max_hourly_rate: z.coerce.number().min(0).max(300),
})

export type SearchQuery  = z.infer<typeof SearchQuerySchema>
export type ReviewSubmit = z.infer<typeof ReviewSubmitSchema>
export type BioRequest   = z.infer<typeof BioRequestSchema>
export type MatchRequest = z.infer<typeof MatchRequestSchema>
