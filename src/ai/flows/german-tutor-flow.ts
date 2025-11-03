'use server';

import { ai } from '@/ai/genkit';
import type { GermanTutorRequest, ChatMessage } from '@/lib/types';
import { marked } from 'marked';

const chatInstruction = `You are a friendly German conversation partner for absolute beginners (A1 level). Your goal is to have a simple and natural conversation in German.
- Use only very basic German vocabulary and simple sentence structures.
- Keep your answers very short and easy to understand.
- Ask simple questions to keep the conversation going.
- Your name is Alex.
- Only speak German.
- Use Markdown for formatting, like **bold** for important words.
`;

const explainInstruction = `You are a friendly and patient German language tutor. Your name is 'Lehrer Alex'.
You are teaching an absolute beginner (A1.1 level).
The user has asked for an explanation of the last thing you said.
Your task is to explain the grammar, vocabulary, or concept from the last assistant message in the history.
Explain it simply in Turkish. Use Markdown for formatting, like lists, **bold** text, or `code` blocks for examples.
Then, give another example in German.

The last part of the conversation was:
---
{{history}}
---
Based on this, explain the last assistant message.
`;

const EXPLAIN_COMMAND = 'Erkläre deine letzte Antwort.';

export async function germanTutor(
  request: GermanTutorRequest
): Promise<ChatMessage> {
  const lastUserMessage = request.history[request.history.length - 1]?.content;

  if (lastUserMessage === EXPLAIN_COMMAND) {
    // Explanation Mode
    const conversationHistory = request.history
      .slice(0, -1) // Remove the command message
      .slice(-4) // Take the last 4 messages for context
      .map((m) => `${m.role === 'user' ? 'User' : 'Alex'}: ${m.content}`)
      .join('\n');

    const prompt = explainInstruction.replace(
      '{{history}}',
      conversationHistory
    );

    const result = await ai.generate({
      prompt,
      model: 'googleai/gemini-2.5-flash',
      config: {
        temperature: 0.3,
      },
    });
    const htmlContent = await marked.parse(result.text);
    return { role: 'model', content: htmlContent };
  } else {
    // Normal Chat Mode
    const conversationHistory = request.history
      .map((m) => `${m.role === 'user' ? 'User' : 'Alex'}: ${m.content}`)
      .join('\n');

    const prompt = `${chatInstruction}\n\nHere is the conversation so far:\n${conversationHistory}\n\nAlex:`;

    const result = await ai.generate({
      prompt,
      model: 'googleai/gemini-2.5-flash',
      config: {
        temperature: 0.7,
      },
    });

    const htmlContent = await marked.parse(result.text);
    return {
      role: 'model',
      content: htmlContent,
    };
  }
}
