import type { Prisma, Notification } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.NotificationCreateArgs>({
  notification: {
    one: {
      data: {
        updatedAt: '2022-11-21T19:26:12.863Z',
        title: 'String',
        body: 'String',
      },
    },
    two: {
      data: {
        updatedAt: '2022-11-21T19:26:12.863Z',
        title: 'String',
        body: 'String',
      },
    },
  },
})

export type StandardScenario = ScenarioData<Notification, 'notification'>
