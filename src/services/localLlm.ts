import { DomainAnalysis } from '../types';
import { generateAgencyResponse, ChatMessage } from './aiAgency';

export interface LocalLlmStatus {
  isAvailable: boolean;
  models: string[];
  activeModel: string;
  provider: 'ollama' | 'builtin';
}

export async function checkLocalLlm(): Promise<LocalLlmStatus> {
  try {
    const res = await fetch('/api/ollama/api/tags', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
      const data = await res.json();
      const models = (data.models || []).map((m: any) => m.name || m.model);
      const activeModel = models.includes('qwen3:14b')
        ? 'qwen3:14b'
        : models[0] || 'qwen3:14b';

      return {
        isAvailable: true,
        models: models.length > 0 ? models : ['qwen3:14b'],
        activeModel,
        provider: 'ollama'
      };
    }
  } catch (err) {
    console.warn('Local Ollama endpoint not reachable through proxy, using built-in model:', err);
  }

  return {
    isAvailable: false,
    models: ['apex-sem-agent-v1 (Built-in)'],
    activeModel: 'apex-sem-agent-v1 (Built-in)',
    provider: 'builtin'
  };
}

export async function queryLocalLlmStream(
  prompt: string,
  analysis: DomainAnalysis,
  provider: 'ollama' | 'builtin',
  modelName: string,
  onToken: (token: string) => void
): Promise<{ fullText: string; actionSnippet?: ChatMessage['actionSnippet'] }> {
  // If provider is Ollama and accessible:
  if (provider === 'ollama') {
    const systemPrompt = `You are ApexSEM AI, an elite autonomous B2B SaaS SEM & SEO Agency Consultant.
Current Domain Being Analyzed:
- Domain: ${analysis.domain} (${analysis.url})
- Niche: ${analysis.niche}
- Audience: ${analysis.targetAudience}
- T1 Authority Score: ${analysis.score.overall}/100 (${analysis.score.tier})
- Monthly Paid Traffic Value: $${analysis.metrics.monthlyPaidValue.toLocaleString()}
- Average CPC in Niche: $${analysis.metrics.averageCpcInNiche}
- Shielded Wasted Ad Spend: $${analysis.metrics.wastedSpendPrevented.toLocaleString()}
- Top Keywords: ${analysis.keywords.slice(0, 3).map(k => `"${k.keyword}" ($${k.cpc})`).join(', ')}

Provide concise, hyper-actionable, expert advice. When relevant, give concrete Google Ads copy, negative keywords, JSON-LD schema, or bidding math. Keep answers structured with clear headings or bullet points.`;

    try {
      const res = await fetch('/api/ollama/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: modelName,
          system: systemPrompt,
          prompt: prompt,
          stream: true,
          options: {
            temperature: 0.7,
            top_p: 0.9
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Ollama returned status ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No readable stream from Ollama');

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.response) {
              fullText += parsed.response;
              onToken(parsed.response);
            }
          } catch (e) {
            // Partial JSON line, continue
          }
        }
      }

      // Check for code blocks in response to provide as snippet
      let actionSnippet: ChatMessage['actionSnippet'] = undefined;
      const codeBlockMatch = fullText.match(/```(?:json|html|javascript|markdown)?\n([\s\S]*?)```/);
      if (codeBlockMatch && codeBlockMatch[1]) {
        actionSnippet = {
          type: 'code',
          content: codeBlockMatch[1].trim()
        };
      }

      return { fullText, actionSnippet };
    } catch (err) {
      console.warn('Ollama streaming error, falling back to built-in agency response:', err);
    }
  }

  // Built-in specialized engine fallback with typewriter streaming
  const fallback = generateAgencyResponse(prompt, analysis);
  const words = fallback.text.split(' ');
  let accumulated = '';

  for (let i = 0; i < words.length; i++) {
    const wordWithSpace = (i === 0 ? '' : ' ') + words[i];
    accumulated += wordWithSpace;
    onToken(wordWithSpace);
    // Slight delay to mimic streaming
    await new Promise((r) => setTimeout(r, 20));
  }

  return {
    fullText: fallback.text,
    actionSnippet: fallback.actionSnippet
  };
}
