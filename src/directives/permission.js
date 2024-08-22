import store from "@/store";

function hasPermission(value, el = false) {
  if (!Array.isArray(value)) {
    throw new Error(
      `需要配置权限，例如v-permission = "['getStatistics3,GET']"`
    );
  }
  // 节点不存在权限里 移除节点
  const hasAuth =
    value.findIndex((v) => store.state.ruleNames.includes(v)) != -1;
  if (el && !hasAuth) {
    el.parentNode && el.parentNode.removeChild(el);
  }
  return hasAuth;
}

// 权限没有该模块不显示，自定义指令，bingding指令对象，el是该节点
export default {
  install(app) {
    app.directive("permission", {
      mounted(el, binding) {
        hasPermission(binding.value, el);
      },
    });
  },
};
