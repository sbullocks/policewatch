import Anthropic from '@anthropic-ai/sdk';
import { AiValidationResult, ViolationType } from '../types/incident';

const client = new Anthropic();

const VIOLATION_LABELS: Record<ViolationType, string> = {
  running_red_light: 'running a red light',
  speeding: 'speeding / excessive speed',
  no_lights_or_sirens: 'operating without required lights or sirens',
  wrong_way_driving: 'driving the wrong way',
  reckless_driving: 'reckless driving',
};

export async function validateIncident(
  frames: Buffer[],
  violationType: ViolationType
): Promise<AiValidationResult> {
  const label = VIOLATION_LABELS[violationType];

  const imageContent = frames.map((frame) => ({
    type: 'image' as const,
    source: {
      type: 'base64' as const,
      media_type: 'image/jpeg' as const,
      data: frame.toString('base64'),
    },
  }));

  const response = await client.messages.create({
    model: 'claude-opus-4-7',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: [
          ...imageContent,
          {
            type: 'text',
            text: `These are sequential frames from a 60-second video submitted as evidence of a law enforcement vehicle ${label}.

Assess whether the frames show visual evidence of this specific violation. Consider: vehicle visibility, traffic signals or signage visible, vehicle movement, context clues.

Respond ONLY with valid JSON in this exact format:
{
  "confidence": "confirmed" | "uncertain" | "not_visible",
  "reasoning": "One to two sentences explaining what you observed."
}

- "confirmed": clear visual evidence of the stated violation
- "uncertain": some evidence but not conclusive — needs human review
- "not_visible": video does not show the stated violation or is too unclear`,
          },
        ],
      },
    ],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    const parsed = JSON.parse(text) as AiValidationResult;
    return parsed;
  } catch {
    return { confidence: 'uncertain', reasoning: 'AI response could not be parsed — flagged for review.' };
  }
}
