export const typeDefs = /* GraphQL */ `
  input CreateSomethingInput {
    name: String!
  }

  input CreateTodoInput {
    title: String!
    dueDate: String
  }

  input ToggleTodoInput {
    id: ID!
  }

  input GetCompleteTodoInput {
    completed: Boolean!
  }

  input DeleteTodoInput {
    id: ID!
  }

  input GetTodoInput {
    id: ID!
  }

  input UpdateTitleInput {
    id: ID!
    title: String!
  }

  type Something {
    id: ID!
    name: String!
  }

  type Mutation {
    createSomething(input: CreateSomethingInput!): Something!
    createTodo(input: CreateTodoInput!): Todo!
    toggleTodo(input: ToggleTodoInput!): Todo!
    deleteTodo(input: DeleteTodoInput!): String!
    updateTodoTitle(input: UpdateTitleInput!): Todo!
  }

  type Query {
    hello: String
    getAllTodos: [Todo!]!
    getAllComplete(input: GetCompleteTodoInput!): [Todo!]!
    getTodo(input: GetTodoInput!): Todo!
    getAllOverdue: [Todo!]!
  }

  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
    createdAt: String!
    updatedAt: String!
    dueDate: String
  }
`;
