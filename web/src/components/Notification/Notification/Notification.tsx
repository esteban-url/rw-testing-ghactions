
import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag,  } from 'src/lib/formatters'

import type { DeleteNotificationMutationVariables, FindNotificationById } from 'types/graphql'

const DELETE_NOTIFICATION_MUTATION = gql`
  mutation DeleteNotificationMutation($id: Int!) {
    deleteNotification(id: $id) {
      id
    }
  }
`

interface Props {
  notification: NonNullable<FindNotificationById['notification']>
}

const Notification = ({ notification }: Props) => {
  const [deleteNotification] = useMutation(DELETE_NOTIFICATION_MUTATION, {
    onCompleted: () => {
      toast.success('Notification deleted')
      navigate(routes.notifications())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteNotificationMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete notification ' + id + '?')) {
      deleteNotification({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Notification {notification.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{notification.id}</td>
            </tr><tr>
              <th>Created at</th>
              <td>{timeTag(notification.createdAt)}</td>
            </tr><tr>
              <th>Updated at</th>
              <td>{timeTag(notification.updatedAt)}</td>
            </tr><tr>
              <th>Title</th>
              <td>{notification.title}</td>
            </tr><tr>
              <th>Body</th>
              <td>{notification.body}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.editNotification({ id: notification.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(notification.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Notification
