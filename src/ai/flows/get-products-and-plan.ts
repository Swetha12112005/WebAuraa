'use server';

/**
 * @fileOverview A flow that generates a plan and product results from an instruction.
 *
 * - getProductsAndPlan - A function that generates a plan and product results.
 * - GetProductsAndPlanInput - The input type for the getProductsAndPlan function.
 * - GetProductsAndPlanOutput - The return type for the getProductsAndPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetProductsAndPlanInputSchema = z.object({
  instruction: z.string().describe('The instruction to generate results for.'),
  taskHistory: z.array(z.string()).optional().describe('The history of recent user instructions.'),
});
export type GetProductsAndPlanInput = z.infer<typeof GetProductsAndPlanInputSchema>;

const ResultSchema = z.object({
    name: z.string().describe('The name of the product.'),
    price: z.string().describe('The price of the product.'),
    link: z.string().url().describe('A real link to the product page on a real domain.'),
    spec: z.string().describe('The key specifications of the product.'),
    imageUrl: z.string().url().describe('A real, direct, and publicly accessible link to an image of the product.'),
});

const GetProductsAndPlanOutputSchema = z.object({
  actions: z.array(z.string()).describe('The sequence of actions to perform.'),
  results: z.array(ResultSchema).describe('The list of generated product results.'),
});
export type GetProductsAndPlanOutput = z.infer<typeof GetProductsAndPlanOutputSchema>;

export async function getProductsAndPlan(
  input: GetProductsAndPlanInput
): Promise<GetProductsAndPlanOutput> {
  return getProductsAndPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getProductsAndPlanPrompt',
  input: {schema: GetProductsAndPlanInputSchema},
  output: {schema: GetProductsAndPlanOutputSchema},
  prompt: `You are an AI assistant that finds real products based on a user's instruction and creates an action plan.

Instruction: {{{instruction}}}

{{#if taskHistory}}
Task History:
{{#each taskHistory}}
- {{{this}}}
{{/each}}
{{/if}}

First, create a short, actionable plan to fulfill the instruction.

Second, generate a list of 3 to 5 real products that match the criteria in the instruction. If there is a task history, take it into account to provide better, more relevant results.

For each product, you MUST provide:
- A real product name.
- The product's price.
- Key specifications.
- A valid, direct link to the product page on a real, existing domain. The link must be a working URL.
- A real, direct, and publicly accessible link to a high-quality image of the product. The image URL must be a working URL.

Do not invent products, links, or image URLs. All information must be real and verifiable.`,
});

const getProductsAndPlanFlow = ai.defineFlow(
  {
    name: 'getProductsAndPlanFlow',
    inputSchema: GetProductsAndPlanInputSchema,
    outputSchema: GetProductsAndPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
