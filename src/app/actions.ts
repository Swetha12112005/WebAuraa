'use server';

import { getProductsAndPlan } from '@/ai/flows/get-products-and-plan';
import { z } from 'zod';

const processInstructionSchema = z.object({
  instruction: z.string().min(1, 'Instruction cannot be empty.').max(500, 'Instruction is too long.'),
  history: z.array(z.string()),
});

export type Result = {
  name: string;
  price: string;
  link: string;
  spec: string;
  imageUrl: string;
};

export type ProcessedData = {
  actions: string[];
  results: Result[];
  history: string[];
  error?: string;
};

export async function processInstruction(
  currentState: ProcessedData,
  formData: FormData
): Promise<ProcessedData> {
  const rawInput = {
    instruction: formData.get('instruction'),
    history: currentState.history,
  };

  const validation = processInstructionSchema.safeParse(rawInput);

  if (!validation.success) {
    return {
        ...currentState,
        error: validation.error.errors[0].message,
    }
  }

  const { instruction, history } = validation.data;

  try {
    const response = await getProductsAndPlan({
      instruction: instruction,
      taskHistory: history,
    });
    
    return {
      actions: response.actions,
      results: response.results,
      history: [instruction, ...history].slice(0, 5), // Keep last 5 instructions
    };
  } catch (error) {
    console.error(error);
    return {
      ...currentState,
      actions: [],
      results: [],
      error: 'Failed to process instruction. The AI model may be offline.',
    };
  }
}
