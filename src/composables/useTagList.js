import { ref } from "vue";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import { useCookies } from "@vueuse/integrations/useCookies";
import { router } from "@/router";

export function useTabList() {
  const route = useRoute();
  const cookie = useCookies();

  const activeTab = ref(route.path);
  const tabList = ref([
    {
      title: "后台首页",
      path: "/",
    },
  ]);

  // 添加标签导航
  function addTab(tab) {
    let noTab = tabList.value.findIndex((t) => t.path == tab.path) == -1;
    if (noTab) {
      tabList.value.push(tab);
    }

    cookie.set("tabList", tabList.value);
  }

  // 初始化标签导航列表
  function initTabList() {
    let tbs = cookie.get("tabList");
    if (tbs) {
      tabList.value = tbs;
    }
  }

  initTabList();

  onBeforeRouteUpdate((to, from) => {
    activeTab.value = to.path;
    addTab({
      title: to.meta.title,
      path: to.path,
    });
  });

  // 改变当前激活指向的路由
  const changeTab = (t) => {
    activeTab.value = t;
    router.push(t);
  };
  // 移除菜单选项
  const removeTab = (t) => {
    let tabs = tabList.value;
    let a = activeTab.value;
    if (a == t) {
      tabs.forEach((tab, index) => {
        if (tab.path == t) {
          const nextTab = tabs[index + 1] || tabs[index - 1];
          if (nextTab) {
            a = nextTab.path;
          }
        }
      });
    }

    activeTab.value = a;

    tabList.value = tabList.value.filter((tab) => tab.path != t);

    cookie.set("tabList", tabList.value);
    router.push(a);
  };

  // 全部删除以及关闭导航其他菜单
  const handleClose = (c) => {
    if (c === "clearAll") {
      activeTab.value = "/";
      tabList.value = [
        {
          title: "后台首页",
          path: "/",
        },
      ];
      router.push("/");
    } else if (c === "clearOther") {
      tabList.value = tabList.value.filter(
        (tab) => tab.path == "/" || tab.path == activeTab.value
      );
    }
    cookie.set("tabList", tabList.value);
  };

  return {
    activeTab,
    tabList,
    changeTab,
    removeTab,
    handleClose,
  };
}
