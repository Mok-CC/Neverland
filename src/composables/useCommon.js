import { ref, reactive, computed } from 'vue'
import { toast } from "@/composables/util"

// 列表，分页，搜索，删除，修改状态
export function useInitTable(opt = {}) {
    // 重置 和 搜索表单
    let searchForm = null
    let resetSearchForm = null
    if (opt.searchForm) {
        searchForm = reactive({ ...opt.searchForm })
        resetSearchForm = () => {
            for (const key in opt.searchForm) {
                searchForm[key] = opt.searchForm[key]
            }
            getData()
        }
    }

    // 公告列表
    const tableData = ref([])

    const loading = ref(false)
    // 分页
    const currentPage = ref(1)
    const total = ref(0)
    const limit = ref(10)

    // 获取数据
    function getData(p = null) {
        // 获取当前页码再去获取数据
        if (typeof p == 'number') {
            currentPage.value = p
        }

        // 加载效果
        loading.value = true
        opt.getList(currentPage.value, searchForm)
            .then(res => {
                if (opt.onGetListSuccess && typeof opt.onGetListSuccess == 'function') {
                    opt.onGetListSuccess(res)
                } else {
                    tableData.value = res.list
                    total.value = res.totalCount
                }
            })
            .finally(() => {
                loading.value = false
            })
    }
    getData()

    // 删除
    const handleDelete = (id) => {
        loading.value = true
        opt.delete(id).then(res => {
            toast("删除成功")
            getData()
        }).finally(() => {
            loading.value = false
        })
    }


    // 修改状态
    const handleStatusChange = (status, row) => {
        row.statusLoading = true
        opt.updateStatus(row.id, status)
            .then(res => {
                toast("修改状态成功")
                row.status = status
                getData()
            })
            .finally(() => {
                row.statusLoading = false
            })
    }


    // 多选选中的ID
    const multiSelectionIds = ref([])
    const handleSelectionChange = (e) => {
        multiSelectionIds.value = e.map(o => o.id)

    }
    // 批量删除
    const multipleTableRef = ref(null)
    const handleMultiDelete = () => {
        loading.value = true
        opt.delete(multiSelectionIds.value)
            .then(res => {
                toast('删除成功')
                if (multipleTableRef.value) {
                    multipleTableRef.value.clearSelection()
                }
                getData()
            })
            .finally(() => {
                loading.value = false
            })
    }

    // 批量修改状态
    const handleMultiStatusChange = (status) => {
        loading.value = true
        opt.updateStatus(multiSelectionIds.value,status)
            .then(res => {
                toast('修改状态成功')
                if (multipleTableRef.value) {
                    multipleTableRef.value.clearSelection()
                }
                getData()
            })
            .finally(() => {
                loading.value = false
            })
    }
    return {
        searchForm,
        resetSearchForm,
        tableData,
        loading,
        currentPage,
        total,
        limit,
        getData,
        handleDelete,
        handleStatusChange,
        handleSelectionChange,
        multipleTableRef,
        handleMultiDelete,
        handleMultiStatusChange,
        multiSelectionIds
    }
}

// 新增 修改
export function useInitForm(opt = {}) {
    // 表单部分
    const formDrawerRef = ref(null)
    const defaultForm = opt.form
    const formRef = ref(null)
    const form = reactive({})
    const rules = opt.rules || null

    const editId = ref(0)
    const drawerTitle = computed(() => editId.value > 0 ? '修改' : '新增')
    // 新增/修改管理员的提交
    const handleSubmit = () => {
        formRef.value.validate((value) => {
            if (!value) return

            formDrawerRef.value.showLoading()
            
            let body = {}
            if(opt.beforeSubmit && typeof opt.beforeSubmit == 'function'){
                body = opt.beforeSubmit({...form})
            }else{
                body = form
            }

            const fun = editId.value > 0 ? opt.update(editId.value, body) : opt.create(body)

            fun.then(res => {
                toast(`${drawerTitle.value}成功`)
                // 修改刷新当前页--false不会更新页码，保持在当前页面  ；新增刷新第一页
                opt.getData(editId.value ? false : 1)
                formDrawerRef.value.close()
            })
                .finally(() => {
                    formDrawerRef.value.hideLoading()
                })
        })
    }

    // 重置表单 根据新增和修改，来确定面板内容是否的重置逻辑
    function resetForm(row = false) {
        if (formRef.value) formRef.value.clearValidate()
        // 把该条公告内容填入修改面板里
        for (const key in defaultForm) {
            form[key] = row[key]
        }
    }
    // 修改公告
    const handleEdit = (item) => {
        editId.value = item.id
        resetForm(item)
        formDrawerRef.value.open()
    }
    // 新增公告
    const handleCreate = () => {
        editId.value = 0
        resetForm(defaultForm)
        formDrawerRef.value.open()
    }

    return {
        formDrawerRef,
        formRef,
        form,
        rules,
        drawerTitle,
        handleSubmit,
        handleCreate,
        handleEdit
    }
}