import type { FindNotificationById } from 'types/graphql'

import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Notification from 'src/components/Notification/Notification'

export const QUERY = gql`
  query FindNotificationById($id: Int!) {
    notification: notification(id: $id) {
      id
      createdAt
      updatedAt
      title
      body
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Notification not found</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ notification }: CellSuccessProps<FindNotificationById>) => {
  return <Notification notification={notification} />
}
