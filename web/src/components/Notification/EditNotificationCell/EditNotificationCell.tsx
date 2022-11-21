import type { EditNotificationById, UpdateNotificationInput } from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import type { CellSuccessProps, CellFailureProps } from '@redwoodjs/web'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import NotificationForm from 'src/components/Notification/NotificationForm'

export const QUERY = gql`
  query EditNotificationById($id: Int!) {
    notification: notification(id: $id) {
      id
      createdAt
      updatedAt
      title
      body
    }
  }
`
const UPDATE_NOTIFICATION_MUTATION = gql`
  mutation UpdateNotificationMutation($id: Int!, $input: UpdateNotificationInput!) {
    updateNotification(id: $id, input: $input) {
      id
      createdAt
      updatedAt
      title
      body
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Failure = ({ error }: CellFailureProps) => (
  <div className="rw-cell-error">{error?.message}</div>
)

export const Success = ({ notification }: CellSuccessProps<EditNotificationById>) => {
  const [updateNotification, { loading, error }] = useMutation(
    UPDATE_NOTIFICATION_MUTATION,
    {
      onCompleted: () => {
        toast.success('Notification updated')
        navigate(routes.notifications())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (
    input: UpdateNotificationInput,
    id: EditNotificationById['notification']['id']
  ) => {
    updateNotification({ variables: { id, input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Edit Notification {notification?.id}</h2>
      </header>
      <div className="rw-segment-main">
        <NotificationForm notification={notification} onSave={onSave} error={error} loading={loading} />
      </div>
    </div>
  )
}
