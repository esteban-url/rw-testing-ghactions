import NotificationCell from 'src/components/Notification/NotificationCell'

type NotificationPageProps = {
  id: number
}

const NotificationPage = ({ id }: NotificationPageProps) => {
  return <NotificationCell id={id} />
}

export default NotificationPage
