import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

import type { EditNotificationById, UpdateNotificationInput } from 'types/graphql'
import type { RWGqlError } from '@redwoodjs/forms'




type FormNotification = NonNullable<EditNotificationById['notification']>

interface NotificationFormProps {
  notification?: EditNotificationById['notification']
  onSave: (data: UpdateNotificationInput, id?: FormNotification['id']) => void
  error: RWGqlError
  loading: boolean
}

const NotificationForm = (props: NotificationFormProps) => {
  const onSubmit = (data: FormNotification) => {
  
    
    
  
    
    
  
    props.onSave(data, props?.notification?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormNotification> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />
      
        <Label
          name="title"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Title
        </Label>
        
          <TextField
            name="title"
            defaultValue={props.notification?.title}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="title" className="rw-field-error" />

        <Label
          name="body"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Body
        </Label>
        
          <TextField
            name="body"
            defaultValue={props.notification?.body}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            validation={{ required: true }}
          />
        

        <FieldError name="body" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit
            disabled={props.loading}
            className="rw-button rw-button-blue"
          >
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default NotificationForm
