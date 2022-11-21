import type { QueryResolvers, MutationResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const notifications: QueryResolvers['notifications'] = () => {
  return db.notification.findMany()
}

export const notification: QueryResolvers['notification'] = ({ id }) => {
  return db.notification.findUnique({
    where: { id },
  })
}

export const createNotification: MutationResolvers['createNotification'] = ({
  input,
}) => {
  return db.notification.create({
    data: input,
  })
}

export const updateNotification: MutationResolvers['updateNotification'] = ({
  id,
  input,
}) => {
  return db.notification.update({
    data: input,
    where: { id },
  })
}

export const deleteNotification: MutationResolvers['deleteNotification'] = ({
  id,
}) => {
  return db.notification.delete({
    where: { id },
  })
}
