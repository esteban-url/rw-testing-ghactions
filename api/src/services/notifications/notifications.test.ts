import type { Notification } from '@prisma/client'

import {
  notifications,
  notification,
  createNotification,
  updateNotification,
  deleteNotification,
} from './notifications'
import type { StandardScenario } from './notifications.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('notifications', () => {
  scenario('returns all notifications', async (scenario: StandardScenario) => {
    const result = await notifications()

    expect(result.length).toEqual(Object.keys(scenario.notification).length)
  })

  scenario(
    'returns a single notification',
    async (scenario: StandardScenario) => {
      const result = await notification({ id: scenario.notification.one.id })

      expect(result).toEqual(scenario.notification.one)
    }
  )

  scenario('creates a notification', async () => {
    const result = await createNotification({
      input: {
        updatedAt: '2022-11-21T19:26:12.848Z',
        title: 'String',
        body: 'String',
      },
    })

    expect(result.updatedAt).toEqual(new Date('2022-11-21T19:26:12.848Z'))
    expect(result.title).toEqual('String')
    expect(result.body).toEqual('String')
  })

  scenario('updates a notification', async (scenario: StandardScenario) => {
    const original = (await notification({
      id: scenario.notification.one.id,
    })) as Notification
    const result = await updateNotification({
      id: original.id,
      input: { updatedAt: '2022-11-22T19:26:12.848Z' },
    })

    expect(result.updatedAt).toEqual(new Date('2022-11-22T19:26:12.848Z'))
  })

  scenario('deletes a notification', async (scenario: StandardScenario) => {
    const original = (await deleteNotification({
      id: scenario.notification.one.id,
    })) as Notification
    const result = await notification({ id: original.id })

    expect(result).toEqual(null)
  })
})
