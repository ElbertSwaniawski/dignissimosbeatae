import { IsOptional, IsString } from 'class-validator'

import { AgentMessage } from '../../../agent/AgentMessage'
import { IsValidMessageType, parseMessageType } from '../../../utils/messageType'

export interface DiscoverFeaturesQueryMessageOptions {
  id?: string
  query: string
  comment?: string
}

export class QueryMessage extends AgentMessage {
  public constructor(options: DiscoverFeaturesQueryMessageOptions) {
    super()

    if (options) {
      this.id = options.id ?? this.generateId()
      this.query = options.query
      this.comment = options.comment
    }
  }

  @IsValidMessageType(QueryMessage.type)
  public readonly type = QueryMessage.type.messageTypeUri
  public static readonly type = parseMessageType('https://didcomm.org/discover-features/1.0/query')

  @IsString()
  public query!: string

  @IsString()
  @IsOptional()
  public comment?: string
}
