import { account } from "./schema/account";
import { session } from "./schema/session";
import { user } from "./schema/user";
import { verification } from "./schema/verification";

export const tableSchemas = { user, session, account, verification };

export { relations } from "./schema/relations";
