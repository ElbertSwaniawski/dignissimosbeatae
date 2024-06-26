import type { ParsedMessageType } from '../../utils/messageType'
import type { ConnectionRecord } from './repository'

import { AriesFrameworkError } from '../../error'
import { canHandleMessageType } from '../../utils/messageType'

import { DidExchangeRequestMessage, DidExchangeResponseMessage, DidExchangeCompleteMessage } from './messages'
import { DidExchangeState, DidExchangeRole } from './models'

export class DidExchangeStateMachine {
  private static createMessageStateRules = [
    {
      message: DidExchangeRequestMessage,
      state: DidExchangeState.InvitationReceived,
      role: DidExchangeRole.Requester,
      nextState: DidExchangeState.RequestSent,
    },
    {
      message: DidExchangeResponseMessage,
      state: DidExchangeState.RequestReceived,
      role: DidExchangeRole.Responder,
      nextState: DidExchangeState.ResponseSent,
    },
    {
      message: DidExchangeCompleteMessage,
      state: DidExchangeState.ResponseReceived,
      role: DidExchangeRole.Requester,
      nextState: DidExchangeState.Completed,
    },
  ]

  private static processMessageStateRules = [
    {
      message: DidExchangeRequestMessage,
      state: DidExchangeState.InvitationSent,
      role: DidExchangeRole.Responder,
      nextState: DidExchangeState.RequestReceived,
    },
    {
      message: DidExchangeResponseMessage,
      state: DidExchangeState.RequestSent,
      role: DidExchangeRole.Requester,
      nextState: DidExchangeState.ResponseReceived,
    },
    {
      message: DidExchangeCompleteMessage,
      state: DidExchangeState.ResponseSent,
      role: DidExchangeRole.Responder,
      nextState: DidExchangeState.Completed,
    },
  ]

  public static assertCreateMessageState(messageType: ParsedMessageType, record: ConnectionRecord) {
    const rule = this.createMessageStateRules.find((r) => canHandleMessageType(r.message, messageType))
    if (!rule) {
      throw new AriesFrameworkError(`Could not find create message rule for ${messageType}`)
    }
    if (rule.state !== record.state || rule.role !== record.role) {
      throw new AriesFrameworkError(
        `Record with role ${record.role} is in invalid state ${record.state} to create ${messageType}. Expected state for role ${rule.role} is ${rule.state}.`
      )
    }
  }

  public static assertProcessMessageState(messageType: ParsedMessageType, record: ConnectionRecord) {
    const rule = this.processMessageStateRules.find((r) => canHandleMessageType(r.message, messageType))
    if (!rule) {
      throw new AriesFrameworkError(`Could not find create message rule for ${messageType}`)
    }
    if (rule.state !== record.state || rule.role !== record.role) {
      throw new AriesFrameworkError(
        `Record with role ${record.role} is in invalid state ${record.state} to process ${messageType}. Expected state for role ${rule.role} is ${rule.state}.`
      )
    }
  }

  public static nextState(messageType: ParsedMessageType, record: ConnectionRecord) {
    const rule = this.createMessageStateRules
      .concat(this.processMessageStateRules)
      .find((r) => canHandleMessageType(r.message, messageType) && r.role === record.role)
    if (!rule) {
      throw new AriesFrameworkError(
        `Could not find create message rule for messageType ${messageType}, state ${record.state} and role ${record.role}`
      )
    }
    return rule.nextState
  }
}
