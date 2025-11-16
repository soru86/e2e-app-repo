import type { Request } from "express";

export type GraphQLContext = {
  user?: {
    id: string;
    roles: string[];
  };
  req: Request;
};

export function buildContext({ req }: { req: Request }): GraphQLContext {
  const user = req.user
    ? {
        id: (req.user as any).id ?? "anonymous",
        roles: ((req.user as any).roles as string[]) ?? [],
      }
    : undefined;
  return { req, user };
}


