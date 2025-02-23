import { type QueryResolvers as IQuery } from "./generated/graphql";
import { Context } from "./context";

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
  }
};
