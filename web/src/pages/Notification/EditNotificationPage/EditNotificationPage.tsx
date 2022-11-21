import EditNotificationCell from 'src/components/Notification/EditNotificationCell'

type NotificationPageProps = {
  id: number
}

const EditNotificationPage = ({ id }: NotificationPageProps) => {
  return <EditNotificationCell id={id} />
}

export default EditNotificationPage
