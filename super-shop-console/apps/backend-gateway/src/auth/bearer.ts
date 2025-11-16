import { createRemoteJWKSet, jwtVerify } from "jose";
import type { NextFunction, Request, Response } from "express";
import { appConfig } from "../config";

const jwks = createRemoteJWKSet(new URL(`${appConfig.keycloak.issuer}/protocol/openid-connect/certs`));

export async function bearerAuthMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next();
  }

  const token = header.slice(7);
  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: appConfig.keycloak.issuer,
      // In some Keycloak versions the "aud" claim may not match the clientId directly.
      // We rely on issuer validation and signature verification here.
    });

    const realmRoles = ((payload as any).realm_access?.roles as string[]) ?? [];
    const clientRoles =
      ((payload as any).resource_access?.[appConfig.keycloak.clientId]?.roles as string[]) ?? [];
    const roles = Array.from(new Set([...realmRoles, ...clientRoles]));

    (req as any).user = {
      id: payload.sub,
      roles,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Invalid bearer token", error);
  }
  next();
}



