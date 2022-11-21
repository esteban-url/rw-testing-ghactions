import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import NotificationForm from 'src/components/Notification/NotificationForm'

import type { CreateNotificationInput } from 'types/graphql'

const CREATE_NOTIFICATION_MUTATION = gql`
  mutation CreateNotificationMutation($input: CreateNotificationInput!) {
    createNotification(input: $input) {
      id
    }
  }
`

const NewNotification = () => {
  const [createNotification, { loading, error }] = useMutation(
    CREATE_NOTIFICATION_MUTATION,
    {
      onCompleted: () => {
        toast.success('Notification created')
        navigate(routes.notifications())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateNotificationInput) => {
    createNotification({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Notification</h2>
      </header>
      <div className="rw-segment-main">
        <NotificationForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewNotification
