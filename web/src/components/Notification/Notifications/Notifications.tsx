import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Notification/NotificationsCell'
import { timeTag, truncate } from 'src/lib/formatters'

import type { DeleteNotificationMutationVariables, FindNotifications } from 'types/graphql'

const DELETE_NOTIFICATION_MUTATION = gql`
  mutation DeleteNotificationMutation($id: Int!) {
    deleteNotification(id: $id) {
      id
    }
  }
`

const NotificationsList = ({ notifications }: FindNotifications) => {
  const [deleteNotification] = useMutation(DELETE_NOTIFICATION_MUTATION, {
    onCompleted: () => {
      toast.success('Notification deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteNotificationMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete notification ' + id + '?')) {
      deleteNotification({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Created at</th>
            <th>Updated at</th>
            <th>Title</th>
            <th>Body</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((notification) => (
            <tr key={notification.id}>
              <td>{truncate(notification.id)}</td>
              <td>{timeTag(notification.createdAt)}</td>
              <td>{timeTag(notification.updatedAt)}</td>
              <td>{truncate(notification.title)}</td>
              <td>{truncate(notification.body)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.notification({ id: notification.id })}
                    title={'Show notification ' + notification.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editNotification({ id: notification.id })}
                    title={'Edit notification ' + notification.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete notification ' + notification.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(notification.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default NotificationsList
