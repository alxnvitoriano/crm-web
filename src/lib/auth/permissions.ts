import { createAccessControl } from "better-auth/plugins/access";

const statement = {
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

export { salesperson, geral_manager, administrative, post_sale, manager_sales, ac, statement };
