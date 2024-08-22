import { ref, reactive } from "vue";
import { logout, updatePassword } from "@/api/manager";
import { showModal } from "@/composables/util";
import { toast } from "@/composables/util";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export function useRepassword() {
  const router = useRouter();
  const store = useStore();

  // 响应式表单
  const formRef = ref(null);
  // 绑定抽屉组件数据
  const formDrawerRef = ref(null);
  const form = reactive({
    oldpassword: "",
    password: "",
    repassword: "",
  });
  /* 验证规则 */
  const rules = {
    oldpassword: [
      {
        required: true,
        message: "旧密码不能为空",
        trigger: "blur",
      },
    ],
    password: [
      {
        required: true,
        message: "新密码不能为空",
        trigger: "blur",
      },
    ],
    repassword: [
      {
        required: true,
        message: "确认密码不能为空",
        trigger: "blur",
      },
    ],
  };
  // 提交登录
  const onSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) {
        return false;
      }
      formDrawerRef.value.showLoading();

      updatePassword(form)
        .then((res) => {
          toast("修改密码成功，请重新登录");
          store.dispatch("logout");
          router.push("/login");
        })
        .finally(() => {
          formDrawerRef.value.hideLoading();
        });
    });
  };
  // 打开抽屉
  const openRePasswordForm = () => formDrawerRef.value.open();

  return {
    formDrawerRef,
    form,
    rules,
    formRef,
    onSubmit,
    openRePasswordForm,
  };
}

export function useLogout() {
  const router = useRouter();
  const store = useStore();
  function handlelogout() {
    showModal("是否退出登录").then((res) => {
      logout().finally(() => {
        store.dispatch("logout");
        // 跳转登录页面
        router.push("/login");
        // 提示成功
        toast("退出登录成功");
      });
    });
  }
  return { handlelogout };
}
