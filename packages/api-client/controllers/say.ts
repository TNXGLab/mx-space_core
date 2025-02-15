import { IRequestAdapter } from '~/interfaces/adapter'
import { IController } from '~/interfaces/controller'
import { IRequestHandler } from '~/interfaces/request'
import { SayModel } from '~/models/say'
import { autoBind } from '~/utils/auto-bind'

import { HTTPClient } from '../core'
import { BaseCrudController } from './base'

declare module '../core/client' {
  interface HTTPClient<
    T extends IRequestAdapter = IRequestAdapter,
    ResponseWrapper = unknown,
  > {
    say: SayController<ResponseWrapper>
  }
}

export class SayController<ResponseWrapper>
  extends BaseCrudController<SayModel, ResponseWrapper>
  implements IController
{
  base = 'says'
  name = 'say'

  constructor(protected client: HTTPClient) {
    super(client)
    autoBind(this)
  }

  public get proxy(): IRequestHandler<ResponseWrapper> {
    return this.client.proxy(this.base)
  }

  /**
   * 获取随机一条
   */
  getRandom() {
    return this.proxy.random.get<{ data: SayModel | null }>()
  }
}
