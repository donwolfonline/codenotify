import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TRPCError } from '@trpc/server';
import type {
  CreateWorkspaceSchema,
  ParamsWorkspaceSchema,
  UpdateWorkspaceSchema,
} from '~/server/api/schema/workspace.schema';
import {
  createWorkspace,
  deleteWorkspace,
  findAllWorkspaces,
  updateWorkspace,
} from '~/server/api/services/workspace.service';
import { type Context } from '~/server/api/trpc';

export const getWorkspacesHandler = async ({ ctx }: { ctx: Context }) => {
  try {
    const workspace = await findAllWorkspaces({
      where: {
        userId: ctx.session?.user.id,
      },
    });

    return {
      data: workspace,
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message,
      });
    } else {
      throw error;
    }
  }
};

export const createWorkspaceHandler = async ({
  input,
  ctx,
}: {
  input: CreateWorkspaceSchema;
  ctx: Context;
}) => {
  try {
    const workspace = await createWorkspace({
      input: {
        title: input.title,
        emoticon: '🗒️',
        slug: input.title, // The service will handle generating a unique slug
        user: {
          connect: {
            id: ctx.session?.user.id,
          },
        },
      },
    });

    return {
      data: workspace,
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A workspace with this title already exists',
        });
      }
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Failed to create workspace',
      });
    }
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    });
  }
};

export const updateWorkspaceHandler = async ({
  input,
  ctx,
}: {
  input: UpdateWorkspaceSchema;
  ctx: Context;
}) => {
  try {
    const workspace = await updateWorkspace({
      where: {
        id: input.params.id,
        userId: ctx.session?.user.id,
      },
      input: {
        title: input.body.title,
        emoticon: input.body.emoticon,
        slug: input.body.title, // The service will handle generating a unique slug
        user: {
          connect: {
            id: ctx.session?.user.id,
          },
        },
      },
    });

    return {
      data: workspace,
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A workspace with this title already exists',
        });
      }
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Failed to update workspace',
      });
    }
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
    });
  }
};

export const deleteWorkspaceHandler = async ({
  paramsInput,
  ctx,
}: {
  paramsInput: ParamsWorkspaceSchema;
  ctx: Context;
}) => {
  try {
    const workspace = await deleteWorkspace({
      where: {
        id: paramsInput.id,
        userId: ctx.session?.user.id,
      },
    });

    return {
      data: workspace,
    };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: error.message,
      });
    } else {
      throw error;
    }
  }
};
