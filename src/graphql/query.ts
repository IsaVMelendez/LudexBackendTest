import { type QueryResolvers as IQuery } from "./generated/graphql";
import { Context } from "./context";
import { GraphQLError } from "graphql";

export const Query: IQuery<Context> = {
  hello: () => "world",

  /**
   * Fetches all the todos from the db
   * 
   * @param _
   * @param __
   * @param prisma - Prisma client
   * @returns All our todos
   */
  getAllTodos: async (_, __, { prisma }) => {
    const todos = await prisma.todo.findMany();
  
    return todos.map(todo => ({
      ...todo,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    }));
  },

  /**
   * Fetches all the incomplete/complete todos, based on query input
   * 
   * @param _
   * @param input - true/false, depending on whether we want complete or incomplete todos
   * @param prisma - Prisma client
   * @returns All our incomplete/complete todos
   */
  getAllComplete: async (_, { input }, { prisma }) => {
    const todos = await prisma.todo.findMany({
      where: {completed: input.completed}
    });
  
    return todos.map(todo => ({
      ...todo,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    }));
  },

  /**
   * Fetches a todo by id
   * 
   * @param _
   * @param input - The id of the todo we want to get
   * @param prisma - Prisma client
   * @returns A todo with the corresponding ID
   */
  getTodo: async (_, { input }, { prisma }) => {
    const todo = await prisma.todo.findUnique({
        where: { id: input.id }
    });

    if (!todo) {
        throw new GraphQLError("Todo not found");
    }

    return {
        ...todo,
        createdAt: todo.createdAt.toISOString(),
        updatedAt: todo.updatedAt.toISOString(),
    };
}
};
