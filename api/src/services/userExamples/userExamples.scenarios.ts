import type { Prisma, UserExample } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserExampleCreateArgs>({
  userExample: {
    one: { data: { email: 'String1938112' } },
    two: { data: { email: 'String2281044' } },
  },
})

export type StandardScenario = ScenarioData<UserExample, 'userExample'>
