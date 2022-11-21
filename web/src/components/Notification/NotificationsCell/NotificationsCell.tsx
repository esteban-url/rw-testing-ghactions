import type { FindNotifications } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'

import Notifications from 'src/components/Notification/Notifications'

export const QUERY = gql`
  query FindNotifications {
    notifications {
      id
      createdAt
      updatedAt
      title
      body
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No notifications yet. '}
      <Link
        to={routes.newNotification()}
        className="rw-link"
      >
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ notifications }: CellSuccessProps<FindNotifications>) => {
  return <Notifications notifications={notifications} />
}
