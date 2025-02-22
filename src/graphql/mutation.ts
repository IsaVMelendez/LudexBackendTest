import { type MutationResolvers as IMutation } from "./generated/graphql";
import { Context } from "./context";

export const Mutation: IMutation<Context> = {
  createSomething: async (_, { input }, { prisma }) => {
    const something = await prisma.something.create({
      data: {
        name: input.name,
      },
    });

    return {
      id: something.id,
      name: something.name,
    };
  },

  /**
   * Creates a new Todo item in the database.
   * 
   * @param _
   * @param input - The input data, in this case it contains just a title
   * @param prisma - Prisma client
   * @returns The todo entity just created
   */
  createTodo: async (_, { input }, { prisma }) => {
    const todo = await prisma.todo.create({
      data: {
        title: input.title,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });

    //Must convert back to string when we return
    return {
      ...todo,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    };
  },

  /**
   * Updates a todo item to set it as completed,
   * also keeping track of what date/time we completed it at
   * 
   * @param _
   * @param input - The input data, which is the id of the todo we want to update
   * @param prisma - Prisma client
   * @returns The todo entity, now updated
   */
  completeTodo: async (_, { input }, { prisma }) => {
    const todo = await prisma.todo.update({
      where: { id: input.id },
      data: {
        completed: true,
        updatedAt: new Date().toISOString(),
      },
    });
  
    return {
      ...todo,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
    };
  }
};
