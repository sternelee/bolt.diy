import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default class WisdomProvider extends BaseProvider {
  name = 'Wisdom';
  getApiKeyLink = 'https://wisdom-gate.juheapi.com/';

  config = {
    apiTokenKey: 'WISDOM_API_KEY',
  };

  staticModels: ModelInfo[] = [
    { name: 'wisdom-ai-gpt5', label: 'Gpt 5 (Wisdom)', provider: 'Wisdom', maxTokenAllowed: 8000 },
    { name: 'wisdom-ai-gpt5-mini', label: 'Gpt 5 mini (Wisdom)', provider: 'Wisdom', maxTokenAllowed: 8000 },
    { name: 'wisdom-ai-dsv3', label: 'Deepspeed v3 (Wisdom)', provider: 'Wisdom', maxTokenAllowed: 8000 },
    { name: 'wisdom-ai-dsr1', label: 'Deepseek R1 (Wisdom)', provider: 'Wisdom', maxTokenAllowed: 8000 },
    { name: 'wisdom-ai-claude-sonnet-4', label: 'Claude-sonnet-4 (Wisdom)', provider: 'Wisdom', maxTokenAllowed: 8000 },
    {
      name: 'wisdom-ai-gemini-2.5-flash',
      label: 'Gemini 2.5 flash (Wisdom)',
      provider: 'Wisdom',
      maxTokenAllowed: 8000,
    },
  ];

  getModelInstance(options: {
    model: string;
    serverEnv: Env;
    apiKeys?: Record<string, string>;
    providerSettings?: Record<string, IProviderSetting>;
  }): LanguageModelV1 {
    const { model, serverEnv, apiKeys, providerSettings } = options;

    const { apiKey } = this.getProviderBaseUrlAndKey({
      apiKeys,
      providerSettings: providerSettings?.[this.name],
      serverEnv: serverEnv as any,
      defaultBaseUrlKey: '',
      defaultApiTokenKey: 'WISDOM_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    const openai = createOpenAI({
      baseURL: 'https://wisdom-gate.juheapi.com/v1',
      apiKey,
    });

    return openai(model);
  }
}
