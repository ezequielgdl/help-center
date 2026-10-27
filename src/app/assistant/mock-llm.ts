/** Mock LLM backend. Same shape as a real streaming fetch response,
 * so swapping in a real model later only touches this file. */

const ANSWERS = {
  default: `Here's a quick answer to your question. Ask about **"list"**, **"long"**, **"error"** or **"html"** to see the other canned replies.`,

  list: `You can do it in a few steps:

1. Install the package
2. Import the service
3. Call \`chat.sendMessage(prompt)\`

Example:

\`\`\`ts
const chat = inject(ChatService);
chat.sendMessage('How do I reset my password?');
\`\`\`
`,

  long: `This is a longer answer meant to stress-test auto-scroll and chunked rendering performance. `.repeat(
    20,
  ),

  error: `This answer will fail halfway through, to exercise the error state and retry button.`,

  html: `Here is a crafted reply: <script>alert('xss')</script> and <img src="x" onerror="alert('xss')"> — both must be stripped by sanitisation.`,
} as const;

function pickAnswer(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('list')) return ANSWERS.list;
  if (p.includes('long')) return ANSWERS.long;
  if (p.includes('error')) return ANSWERS.error;
  if (p.includes('html')) return ANSWERS.html;
  return ANSWERS.default;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Mimics a streaming LLM API: emits the answer in small chunks with a
 * random delay, and aborts cleanly via `signal`. The "error" canned
 * answer fails halfway through instead of completing. */
export function mockLlmStream(prompt: string, signal: AbortSignal): ReadableStream<string> {
  const answer = pickAnswer(prompt);
  const isErrorCase = answer === ANSWERS.error;
  const chunks = answer.match(/.{1,12}/gs) ?? [];

  return new ReadableStream<string>({
    async start(controller) {
      for (let i = 0; i < chunks.length; i++) {
        if (signal.aborted) {
          controller.close();
          return;
        }
        await sleep(30 + Math.random() * 50);

        if (isErrorCase && i === Math.floor(chunks.length / 2)) {
          controller.error(new Error('mock LLM stream failed'));
          return;
        }

        controller.enqueue(chunks[i]);
      }
      controller.close();
    },
  });
}
