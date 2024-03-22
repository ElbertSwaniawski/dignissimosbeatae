import { ArrayNotEmpty, IsOptional, IsString } from 'class-validator'

import { DidDocumentService } from './DidDocumentService'

export class IndyAgentService extends DidDocumentService {
  public constructor(options: {
    id: string
    serviceEndpoint: string
    recipientKeys: string[]
    routingKeys?: string[]
    priority?: number
  }) {
    super({ ...options, type: IndyAgentService.type })

    if (options) {
      this.recipientKeys = options.recipientKeys
      this.routingKeys = options.routingKeys
      if (options.priority) this.priority = options.priority
    }
  }

  public static type = 'IndyAgent'

  @ArrayNotEmpty()
  @IsString({ each: true })
  public recipientKeys!: string[]

  @IsString({ each: true })
  @IsOptional()
  public routingKeys?: string[]

  public priority = 0
}
