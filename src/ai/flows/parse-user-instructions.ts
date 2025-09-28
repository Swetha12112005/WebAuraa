'use server';

/**
 * @fileOverview Parses natural language instructions into actionable steps using a local LLM tool.
 *
 * - parseUserInstructions - A function that handles the parsing of user instructions.
 * - ParseUserInstructionsInput - The input type for the parseUserInstructions function.
 * - ParseUserInstructionsOutput - The return type for the parseUserInstructions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParseUserInstructionsInputSchema = z.object({
  instruction: z.string().describe('The natural language instruction from the user.'),
  taskHistory: z.string().optional().describe('The history of recent user instructions.'),
});
export type ParseUserInstructionsInput = z.infer<typeof ParseUserInstructionsInputSchema>;

const ParseUserInstructionsOutputSchema = z.object({
  actionableSteps: z.array(z.string()).describe('The actionable steps extracted from the instruction.'),
});
export type ParseUserInstructionsOutput = z.infer<typeof ParseUserInstructionsOutputSchema>;

export async function parseUserInstructions(input: ParseUserInstructionsInput): Promise<ParseUserInstructionsOutput> {
  return parseUserInstructionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseUserInstructionsPrompt',
  input: {schema: ParseUserInstructionsInputSchema},
  output: {schema: ParseUserInstructionsOutputSchema},
  prompt: `You are an AI agent that parses user instructions into actionable steps.

  The user instruction is:
  {{{instruction}}}

  {{#if taskHistory}}The task history is:
  {{{taskHistory}}}
  {{/if}}

  Extract the actionable steps from the instruction.  If there is task history, take that into account when extracting the actionable steps.

  Return the actionable steps as a JSON array of strings.
  Example:
  [
    "open browser",
    "search for laptops under 50k",
    "list top 5"
  ]
  `,
});

const parseUserInstructionsFlow = ai.defineFlow(
  {
    name: 'parseUserInstructionsFlow',
    inputSchema: ParseUserInstructionsInputSchema,
    outputSchema: ParseUserInstructionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
