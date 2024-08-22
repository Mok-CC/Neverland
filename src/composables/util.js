import nprogress from "nprogress";

// 成功提示
export function toast(
  message,
  type = "success",
  dangerouslyUseHTMLString = true
) {
  ElNotification({
    type,
    message,
    dangerouslyUseHTMLString,
    duration: 1500,
  });
}
// 弹出提示框
export function showModal(content = "提示内容", type = "warning", title = "") {
  return ElMessageBox.confirm(content, title, {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type,
  });
}
// 显示全屏loading
export function showFullLoading() {
  nprogress.start();
}
// 隐藏loading
export function hideFullLoading() {
  nprogress.done();
}

// 弹出输入框
export function showPrompt(tip, value = "") {
  return ElMessageBox.prompt(tip, "", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    inputValue: value,
  });
}

// 拼接api接口
export function queryParams(query) {
  let q = [];
  for (const key in query) {
    if (query[key]) {
      q.push(`${key}=${encodeURIComponent(query[key])}`);
    }
  }
  let r = q.join("&");
  r = r ? "?" + r : "";
  return r;
}

// 规格上移
export function useArrayMoveUp(arr, index) {
  swapArray(arr, index, index - 1);
}

// 规格下移
export function useArrayMoveDown(arr, index) {
  swapArray(arr, index, index + 1);
}

// 交换排序
function swapArray(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}

// sku排列算法
export function cartesianProductOf() {
  return Array.prototype.reduce.call(
    arguments,
    function (a, b) {
      var ret = [];
      a.forEach(function (a) {
        b.forEach(function (b) {
          ret.push(a.concat([b]));
        });
      });
      return ret;
    },
    [[]]
  );
}
