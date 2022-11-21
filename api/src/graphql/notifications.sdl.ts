export const schema = gql`
  type Notification {
    id: Int!
    createdAt: DateTime!
    updatedAt: DateTime!
    title: String!
    body: String!
  }

  type Query {
    notifications: [Notification!]! @requireAuth
    notification(id: Int!): Notification @requireAuth
  }

  input CreateNotificationInput {
    title: String!
    body: String!
  }

  input UpdateNotificationInput {
    title: String
    body: String
  }

  type Mutation {
    createNotification(input: CreateNotificationInput!): Notification!
      @requireAuth
    updateNotification(
      id: Int!
      input: UpdateNotificationInput!
    ): Notification! @requireAuth
    deleteNotification(id: Int!): Notification! @requireAuth
  }
`
