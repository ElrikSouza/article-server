import { Inject, Module } from '@nestjs/common';

import amqp, { AmqpConnectionManager } from 'amqp-connection-manager';

@Module({
  providers: [
    {
      provide: 'queue',
      useFactory: async () => {
        return amqp.connect(['amqp://localhost']);
      },
    },
  ],
  exports: ['queue'],
})
export class QueueModule {
  constructor(@Inject('queue') private readonly queue: AmqpConnectionManager) {}

  onModuleDestroy() {
    return this.queue.close();
  }
}
