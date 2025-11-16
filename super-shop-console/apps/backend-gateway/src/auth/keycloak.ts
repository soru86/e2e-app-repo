import passport from "passport";
import { Strategy as OpenIDConnectStrategy } from "passport-openidconnect";
import { appConfig } from "../config";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

passport.use(
  "keycloak",
  new OpenIDConnectStrategy(
    {
      issuer: appConfig.keycloak.issuer,
      authorizationURL: `${appConfig.keycloak.issuer}/protocol/openid-connect/auth`,
      tokenURL: `${appConfig.keycloak.issuer}/protocol/openid-connect/token`,
      userInfoURL: `${appConfig.keycloak.issuer}/protocol/openid-connect/userinfo`,
      clientID: appConfig.keycloak.clientId,
      clientSecret: appConfig.keycloak.clientSecret,
      callbackURL: appConfig.keycloak.callbackUrl,
      scope: "openid profile email",
    },
    (issuer, profile, context, idToken, accessToken, refreshToken, done) => {
      const roles = (profile._json?.realm_access?.roles as string[]) ?? [];
      done(null, {
        id: profile.id,
        displayName: profile.displayName,
        roles,
        accessToken,
        refreshToken,
      });
    },
  ),
);

export const keycloakAuth = passport;


