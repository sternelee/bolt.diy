import { BaseProvider } from '~/lib/modules/llm/base-provider';
import type { ModelInfo } from '~/lib/modules/llm/types';
import type { IProviderSetting } from '~/types/model';
import type { LanguageModelV1 } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

export default class FlowProvider extends BaseProvider {
  name = 'Flow';
  getApiKeyLink = 'https://iflow.cn/?open=setting';

  config = {
    apiTokenKey: 'IFLOW_API_KEY',
  };

  staticModels: ModelInfo[] = [
    { name: 'TBStars2-200B-A13B', label: 'TBSTARS-2.0-200B-A13B', provider: 'Flow', maxTokenAllowed: 8000 },
    { name: 'DeepSeek-R1', label: 'DeepSeek-R1', provider: 'Flow', maxTokenAllowed: 8000 },
    { name: 'DeepSeek-V3', label: 'DeepSeek-V3', provider: 'Flow', maxTokenAllowed: 8000 },
    { name: 'Qwen3-Coder', label: 'Qwen3-Coder', provider: 'Flow', maxTokenAllowed: 8000 },
    { name: 'KIMI-K2', label: 'KIMI-K2', provider: 'Flow', maxTokenAllowed: 8000 },
    {
      name: 'Qwen3-235B-A22B-Thinking-2507',
      label: 'Qwen3-235B-A22B-Thinking-2507',
      provider: 'Flow',
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
      defaultApiTokenKey: 'IFLOW_API_KEY',
    });

    if (!apiKey) {
      throw new Error(`Missing API key for ${this.name} provider`);
    }

    const openai = createOpenAI({
      baseURL: 'https://apis.iflow.cn/v1',
      apiKey,
    });

    return openai(model);
  }
}
