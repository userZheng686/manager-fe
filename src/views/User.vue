<template>
  <div class="user-manage">
    <div class="query-form">
      <el-form ref="form" :inline="true" :model="user">
        <el-form-item prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item prop="userName">
          <el-input
            v-model="user.userName"
            placeholder="请输入用户名称"
          ></el-input>
        </el-form-item>
        <el-form-item prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增</el-button>
        <el-button type="danger" @click="handlePatchDel">批量删除</el-button>
      </div>
      <el-table
        :data="userList"
        @selection-change="handleSectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDel(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        background
        layout="prev,pager,next"
        :total="pager.total"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <div class="drag" v-drag>
      <el-dialog title="用户新增" v-model="showModal" :before-close="handleClose">
        <el-form
          ref="dialogForm"
          :model="userForm"
          label-width="100px"
          :rules="rules"
        >
          <el-form-item label="用户名" prop="userName">
            <el-input
              v-model="userForm.userName"
              :disabled="action === 'edit'"
              placeholder="请输入用户名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="userEmail">
            <el-input v-model="userForm.userEmail" placeholder="请输入用户邮箱" :disabled="action === 'edit'">
              <template #append> @qq.com </template>
            </el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input
              v-model="userForm.mobile"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item label="岗位" prop="job">
            <el-input v-model="userForm.job" placeholder="请输入岗位"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="state">
            <el-select v-model="userForm.state">
              <el-option :value="1" label="在职"></el-option>
              <el-option :value="2" label="离职"></el-option>
              <el-option :value="3" label="试用期"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="系统角色" prop="roleList">
            <el-select
              v-model="userForm.roleList"
              placeholder="请选择用户系统角色"
              multiple
              style="width: 100%;"
            >
              <el-option 
              v-for="role in roleList" 
              :label="role.roleName" 
              :key="role._id" 
              :value="role._id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="部门" prop="deptId">
            <el-cascader
              v-model="userForm.deptId"
              placeholder="请选择所属部门"
              :options="deptList"
              :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
              clearable
              style="width: 100%;"
            ></el-cascader>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleClose">取消</el-button>
            <el-button type="primary" @click="handleSubmit"
              >确定</el-button
            >
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, onMounted, ref,toRaw } from "vue";
import utils from '../utils/utils'

export default {
  name: "user",
  setup() {
    const { ctx } = getCurrentInstance();
    const instance = getCurrentInstance();
    const { $api, $message } = instance.appContext.config.globalProperties;
    const user = reactive({
      state: 0,
    });
    const userList = ref([]);
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
      total: 0,
    });
    //定义表单列
    const columns = reactive([
      {
        label: "用户ID",
        prop: "userId",
      },
      {
        label: "用户名",
        prop: "userName",
      },
      {
        label: "用户邮箱",
        prop: "userEmail",
      },
      {
        label: "用户角色",
        prop: "role",
        formatter(row, column, value) {
          return {
            0: "管理员",
            1: "普通用户",
          }[value];
        },
      },
      {
        label: "用户状态",
        prop: "state",
        formatter(row, column, value) {
          return {
            1: "在职",
            2: "离职",
            3: "试用期",
          }[value];
        },
      },
      {
        label: "注册时间",
        prop: "createTime",
        width:180,
        formatter(row,column,value){
           return utils.formatDate(new Date(value))
        }
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
        width:180,
        formatter(row,column,value){
           return utils.formatDate(new Date(value))
        }
      },
    ]);
    //定义表单数据
    const userForm = reactive({
      userName: "",
      userEmail: "",
      mobile: "",
      job: "",
      state: 3,
      roleList: "",
      deptId: "",
    });
    //定义表单校验规则
    const rules = reactive({
      userName: [
        {
          required: true,
          message: "请输入用户名称",
          trigger: "blur",
        },
      ],
      userEmail: [
        {
          required: true,
          message: "请输入邮箱",
          trigger: "blur",
        },
      ],
      mobile: [
        {
          pattern: /1[3-9]\d{9}/,
          message: "请输入正确的手机号格式",
          trigger: "blur",
        },
      ],
      deptId: [
        {
          required: true,
          message: "请选择所属部门",
          trigger: "blur",
        },
      ],
    });
    //角色列表
    const roleList = ref([])
    //部门列表
    const deptList = ref([])
    //定义用户操作的行为
    const action = ref('add')

    //用户弹窗关闭
    const handleClose = () => {
        showModal.value = false
        handleReset('dialogForm')
    }

    //用户提交
    const handleSubmit = () => {
        ctx.$refs.dialogForm.validate(async (valid) => {
            if(valid){
                let params = toRaw(userForm);
                params.userEmail += '@qq.com'
                params.action = action.value
                let res = await $api.userSubmit(params)
                if(res){
                    showModal.value = false
                    if(action.value === 'add'){
                        $message.success('创建成功')
                    }else{
                        $message.success('更新成功')
                    }
                    
                    handleReset('dialogForm')
                    getUserList()
                }
            }
        })
    }
    
    //用户编辑
    const handleEdit = (row) => {
        action.value = 'edit'
        showModal.value = true
        ctx.$nextTick(() => {
            Object.assign(userForm,row)
        })
        
    }


    onMounted(() => {
      getUserList();
      getDeptList();
      getRoleAllList();
    });

    // 获取用户列表
    const getUserList = async () => {
      let params = { ...user, ...pager };
      try {
        const { list, page } = await $api.getUserList(params);
        userList.value = list;
        pager.total = page.total;
      } catch (error) {}
    };

    //选中用户的列表对象
    const checkedUserIds = ref([]);

    //弹框显示对象
    const showModal = ref(false);

    //处理表单查询
    const handleQuery = () => {
      getUserList();
    };

    //处理表单重置
    const handleReset = (form) => {
      ctx.$refs[form].resetFields();
    };

    //分页事件处理
    const handleCurrentChange = (current) => {
      pager.pageNum = current;
      getUserList();
    };

    //删除事件
    const handleDel = async (row) => {
      await $api.userDel({
        userIds: [row.userId],
      });
      $message.success("删除成功");
      getUserList();
    };

    //批量删除
    const handlePatchDel = async () => {
      if (checkedUserIds.value.length === 0) {
        $message.error("请选择要删除的用户");
        return;
      }
      const res = await $api.userDel({
        userIds: checkedUserIds.value,
      });
      if (res.matchedCount > 0) {
        $message.success("删除成功");
        getUserList();
      } else {
        $message.success("删除失败");
      }
    };

    //表格多选
    const handleSectionChange = (list) => {
      console.log("list", list);
      let arr = [];
      list.map((item) => {
        arr.push(item.userId);
      });
      checkedUserIds.value = arr;
    };

    //用户新增
    const handleCreate = () => {
      showModal.value = true;
      action.value = 'add'
    };

    const getDeptList = async () => {
      const list = await $api.getDeptList()
      deptList.value = list
    }

    const getRoleAllList = async () => {
      const list = await $api.getRoleAllList()
      roleList.value = list
    }

    return {
      user,
      userList,
      columns,
      action,
      pager,
      rules,
      roleList,
      deptList,
      userForm,
      getUserList,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleDel,
      handlePatchDel,
      handleSectionChange,
      handleClose,
      handleSubmit,
      showModal,
      handleCreate,
      checkedUserIds,
      getDeptList,
      getRoleAllList,
      handleEdit
    };
  },
};
</script>

<style lang="scss" scoped></style>
