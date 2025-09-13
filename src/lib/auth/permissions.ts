import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/organization/access";

const statement = {
  ...defaultStatements,
  project: ["create", "view", "update", "delete", "management"],
} as const;

const ac = createAccessControl(statement);

const salesperson = ac.newRole({
  project: ["view", "update"],
});

const geral_manager = ac.newRole({
  project: ["create", "view", "update", "delete", "management"],
});

const administrative = ac.newRole({
  project: ["update"],
});

const post_sale = ac.newRole({
  project: ["update"],
});

const manager_sales = ac.newRole({
  project: ["view", "update", "management"],
});

const owner = ac.newRole({
  ...adminAc.statements,
  project: ["create", "view", "update", "delete", "management"],
});

export {
  salesperson,
  geral_manager,
  administrative,
  post_sale,
  manager_sales,
  owner,
  ac,
  statement,
};
