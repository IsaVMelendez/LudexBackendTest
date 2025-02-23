export const typeDefs = /* GraphQL */ `
  input CreateSomethingInput {
    name: String!
  }

  input CreateTodoInput {
    title: String!
  }

  input ToggleTodoInput {
    id: ID!
  }

  type Something {
    id: ID!
    name: String!
  }

  type Mutation {
    createSomething(input: CreateSomethingInput!): Something!
    createTodo(input: CreateTodoInput!): Todo!
    toggleTodo(input: ToggleTodoInput!): Todo!
  }

  type Query {
    hello: String
    getAllTodos: [Todo!]!
  }

  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
    createdAt: String!
    updatedAt: String!
  }
`;
