export const VIOLATION_TYPES = [
  'running_red_light',
  'speeding',
  'no_lights_or_sirens',
  'wrong_way_driving',
  'reckless_driving',
] as const;

export type ViolationType = (typeof VIOLATION_TYPES)[number];

export type IncidentStatus = 'PUBLISHED' | 'PENDING_REVIEW' | 'REJECTED';

export interface CreateIncidentInput {
  latitude: number;
  longitude: number;
  address: string;
  violationType: ViolationType;
  vehicleDesc?: string;
  incidentAt: string;
}

export interface AiValidationResult {
  confidence: 'confirmed' | 'uncertain' | 'not_visible';
  reasoning: string;
}
