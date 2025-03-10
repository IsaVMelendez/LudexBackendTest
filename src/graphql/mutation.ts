import { type MutationResolvers as IMutation } from "./generated/graphql";
import { Context } from "./context";
import { GraphQLError } from "graphql";

function parseDateInput(dateStr: string) {
  const regexPattern = /^\d{2}-\d{2}-\d{4}$/;
  if (!regexPattern.test(dateStr)) {
    throw new Error("Invalid date format; should be DD-MM-YYYY.");
  }

  const [day, month, year] = dateStr.split('-');

  //Put the user input in ISO format
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);

  return date.toISOString();
}

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
    if(input.title==""||!input.title){
      throw new GraphQLError("Todo title cannot be empty or null.");
    }

    let dueDate = null;
    if (input.dueDate) {
      try {
        dueDate = parseDateInput(input.dueDate);
      } catch (error) {
        throw new GraphQLError(`Invalid dueDate format : ${error}`);
      }
    }

    const todo = await prisma.todo.create({
      data: {
        title: input.title,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: dueDate
      },
    });

    //Must convert back to string when we return
    return {
      ...todo,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
      dueDate: todo.dueDate ? todo.dueDate.toISOString() : null,
    };
  },

  /**
   * Updates a todo item to set it as completed if its incomplete, and incomplete if it's complete
   * also keeping track of what date/time we modified it at
   * 
   * @param _
   * @param input - The input data, which is the id of the todo we want to update
   * @param prisma - Prisma client
   * @returns The todo entity, now updated
   */
  toggleTodo: async (_, { input }, { prisma }) => {
    //Get the todo so we know its current completed state
    const myTodo = await prisma.todo.findUnique({
      where: { id: input.id }
    });
  
    if (!myTodo) {
      throw new GraphQLError("Invalid ID, todo not found");
    }
  
    //Run the update query to change it
    const updatedTodo = await prisma.todo.update({
      where: { id: input.id },
      data: {
        completed: !myTodo.completed,
        updatedAt: new Date().toISOString(),
      },
    });
  
    return {
      ...updatedTodo,
      createdAt: updatedTodo.createdAt.toISOString(),
      updatedAt: updatedTodo.updatedAt.toISOString(),
      dueDate: updatedTodo.dueDate ? updatedTodo.dueDate.toISOString() : null,
    };
  },

  /**
   * Updates a todo item's title
   * 
   * @param _
   * @param input - The input data, containing the id of the item as well as the new title
   * @param prisma - Prisma client
   * @returns The todo entity, now updated
   */
  updateTodoTitle: async (_, { input }, { prisma }) => {
    const myTodo = await prisma.todo.findUnique({
      where: { id: input.id }
    });
  
    if (!myTodo) {
      throw new GraphQLError("Invalid ID, todo not found");
    } else if(input.title==""||!input.title){
      throw new GraphQLError("Todo title cannot be empty or null.");
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: input.id },
      data: {
        title: input.title,
        updatedAt: new Date().toISOString(),
      },
    });
  
    return {
      ...updatedTodo,
      createdAt: updatedTodo.createdAt.toISOString(),
      updatedAt: updatedTodo.updatedAt.toISOString(),
      dueDate: updatedTodo.dueDate ? updatedTodo.dueDate.toISOString() : null
    };
  },

  /**
   * Deletes a todo based on its id
   * 
   * @param _
   * @param input - The id of the todo to delete
   * @param prisma - Prisma client
   * @returns A confirmation message
   */
  deleteTodo: async (_, { input }, { prisma }) => {
    const myTodo = await prisma.todo.findUnique({
      where: { id: input.id }
    });

    if(!myTodo){
      throw new GraphQLError("Invalid id: Todo not found")
    }

    await prisma.todo.delete({
      where: { id: input.id }
    });

    return `Todo named "${myTodo.title}" has been successfully deleted`;
  },
};
