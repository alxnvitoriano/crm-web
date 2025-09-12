import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [customSessionClient<typeof auth>(), organizationClient()],
});
