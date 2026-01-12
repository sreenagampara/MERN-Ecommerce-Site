export const canManage = (role, resource) => {
  if (!role) return false;
  if (role === "SUPER_ADMIN") return true;

  const permissions = {
    PRODUCT_ADMIN: ["Product","Ad"],
    ORDER_ADMIN: ["Order"],
    SUPPORT_ADMIN: ["User", "Order"],
  };

  const allowed = permissions[role]?.includes(resource);
  return allowed;
};
