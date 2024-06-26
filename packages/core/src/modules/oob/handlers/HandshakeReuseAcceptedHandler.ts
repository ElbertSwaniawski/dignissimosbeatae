import type { Handler } from '../../../agent/Handler'
import type { InboundMessageContext } from '../../../agent/models/InboundMessageContext'
import type { OutOfBandService } from '../OutOfBandService'

import { HandshakeReuseAcceptedMessage } from '../messages/HandshakeReuseAcceptedMessage'

export class HandshakeReuseAcceptedHandler implements Handler {
  public supportedMessages = [HandshakeReuseAcceptedMessage]
  private outOfBandService: OutOfBandService

  public constructor(outOfBandService: OutOfBandService) {
    this.outOfBandService = outOfBandService
  }

  public async handle(messageContext: InboundMessageContext<HandshakeReuseAcceptedMessage>) {
    messageContext.assertReadyConnection()

    await this.outOfBandService.processHandshakeReuseAccepted(messageContext)
  }
}
