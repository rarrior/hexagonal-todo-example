// GraphQL Schema Definition
import gql from 'graphql-tag';

export const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    completed: Boolean!
  }

  input CreateTaskInput {
    title: String!
    completed: Boolean
  }

  type Query {
    tasks: [Task!]!
    task(id: ID!): Task
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
  }
`;
