import { ChatOpenAI } from '@langchain/openai'
import { Injectable, Logger } from '@nestjs/common'

import { BizException } from '~/common/exceptions/biz.exception'
import { ErrorCodeEnum } from '~/constants/error-code.constant'

import { ConfigsService } from '../configs/configs.service'

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name)

  constructor(private readonly configService: ConfigsService) {}

  public async getOpenAiChain() {
    const {
      ai: { openAiKey, openAiEndpoint, openAiPreferredModel },
    } = await this.configService.waitForConfigReady()
    if (!openAiKey) {
      this.logger.warn('OpenAI API key not found')
      throw new BizException(ErrorCodeEnum.AINotEnabled, 'Key not found')
    }

    try {
      this.logger.debug(
        `Initializing OpenAI chain with model: ${openAiPreferredModel}`,
      )
      return new ChatOpenAI({
        model: openAiPreferredModel,
        apiKey: openAiKey,
        configuration: {
          baseURL: openAiEndpoint || void 0,
        },
      })
    } catch (error) {
      this.logger.error('OpenAI API Error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })
      throw error
    }
  }
}
