/**
 * Convert flat module records into a sorted tree.
 *
 * @param {Array<Object>} records Flat module and feature records.
 * @returns {Array<Object>} Root modules with feature children.
 */
export function buildModuleTree(records) {
  const featuresByParent = records
    .filter((item) => item.type === "feature")
    .reduce((result, item) => {
      const children = result[item.parentId] || [];
      return { ...result, [item.parentId]: [...children, item] };
    }, {});

  return records
    .filter((item) => item.type === "module")
    .sort((first, second) => first.sort - second.sort)
    .map((module) => ({
      ...module,
      children: (featuresByParent[module.id] || []).sort(
        (first, second) => first.sort - second.sort
      ),
    }));
}

/**
 * Build the module tree visible to a frontend visitor.
 *
 * A feature is visible only when both its own switch and its parent module are
 * enabled. Authentication and permission visibility rules are evaluated for
 * both levels so hidden modules cannot leak protected feature metadata.
 *
 * @param {Array<Object>} records Flat module and feature records.
 * @param {Object} access Viewer access context.
 * @param {boolean} access.authenticated Whether the viewer is signed in.
 * @param {Array<string>} access.permissionIds Effective viewer permissions.
 * @returns {Array<Object>} Visible modules with visible feature children.
 */
export function buildVisibleModuleTree(
  records,
  { authenticated = false, permissionIds = [] } = {}
) {
  const canView = (item) => {
    if (item.status !== "enabled") return false;
    if (item.visibility === "authenticated") return authenticated;
    if (item.visibility === "permission") {
      return authenticated && permissionIds.includes(item.permissionId);
    }
    return true;
  };

  return buildModuleTree(records)
    .filter(canView)
    .map((module) => ({
      ...module,
      children: module.children.filter(canView),
    }))
    .filter((module) => module.children.length > 0);
}
