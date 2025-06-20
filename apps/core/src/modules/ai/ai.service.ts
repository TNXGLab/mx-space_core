import { ChatOpenAI } from '@langchain/openai'
import { Injectable, Logger } from '@nestjs/common'

import { BizException } from '~/common/exceptions/biz.exception'
import { ErrorCodeEnum } from '~/constants/error-code.constant'

import { ConfigsService } from '../configs/configs.service'

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name)

  constructor(private readonly configService: ConfigsService) {}

  public async getOpenAiChain(options?: { maxTokens?: number }) {
    const {
      ai: { openAiKey, openAiEndpoint, openAiPreferredModel },
      url: { webUrl },
    } = await this.configService.waitForConfigReady()
    if (!openAiKey) {
      this.logger.warn('OpenAI API key not found')
      throw new BizException(ErrorCodeEnum.AINotEnabled, 'Key not found')
    }

    return new ChatOpenAI({
      model: openAiPreferredModel,
      apiKey: openAiKey,
      configuration: {
        baseURL: openAiEndpoint || void 0,
        defaultHeaders: {
          'X-Title': 'Mix Space AI Client',
          'HTTP-Referer': webUrl,
        },
      },
      maxTokens: options?.maxTokens,
    })
  }
}
