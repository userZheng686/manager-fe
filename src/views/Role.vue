<template>
    <div class="query-form">
        <el-form ref="form" :inline="true" :model="queryForm">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="queryForm.roleName" placeholder="请输入菜单ID"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getRoleList">查询</el-button>
                <el-button @click="handleReset('form')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="base-table">
        <div class="action">
            <el-button type="primary" @click="handleAdd">创建</el-button>
        </div>
        <el-table :data="roleList" v-loading="roleList.length === 0" >
            <el-table-column
                v-for="item in columns"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :formatter="item.formatter"
            />
            <el-table-column label="操作" width="260">
                <template #default="scope">
                    <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="primary" size="mini" @click="handleOpenPermission(scope.row)">设置权限</el-button>
                    <el-button type="danger" size="mini" @click="handleDel(scope.row._id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
        class="pagination"
        background
        layout="prev,pager,next"
        :total="pager.total"
        :page-size="pager.pageSize"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    
    <div class="drag" v-drag>
        <el-dialog title="角色新增" v-model="showModal" :before-close="handleClose">
        <el-form
            ref="dialogForm"
            :model="roleForm"
            label-width="100px"
            :rules="rules"
        >
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="roleForm.roleName" placeholder="请输入角色名称"> </el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input type="textarea" :rows="2" v-model="roleForm.remark" placeholder="请输入备注"> </el-input>
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

    <div class="drag" v-drag>
        <el-dialog title="权限设置" v-model="showPermission" :before-close="() => {showPermission = false}">
        <el-form
            ref="dialogForm"
            :rules="rules"
        >
            <el-form-item label="角色名称" prop="roleName">
              {{curRoleName}}
            </el-form-item>
            <el-form-item label="选择权限" prop="remark">
               <el-tree
                ref="permissionTree"
                :data="getMenu"
                show-checkbox
                default-expand-all
                node-key="_id"
                :props="{label:'menuName'}"
               ></el-tree>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
            <el-button @click="showPermission = false">取消</el-button>
            <el-button type="primary" @click="handlePermissionSubmit"
                >确定</el-button
            >
            </span>
        </template>
        </el-dialog>
    </div>
</template>

<script>
import util from '../utils/utils'
export default {
    name: 'role',
    data() {
        return {
            queryForm : {
                roleName : '',
            },
            pager : {
                total : 0,
                pageNum : 1,
                pageSize : 10
            },
            showModal : false,
            action : 'create',
            columns : [{
                label : '角色名称',
                prop : 'roleName'
            },{
                label : '备注',
                prop : 'remark'
            },{
                label : '权限列表',
                prop : 'permissionList',
                formatter :(row,column,value) => {

                    let names = []
                    let list = value.halfCheckedKeys || []
                    list.map(key => {
                        let name = this.actionMap[key]
                        if(key && name) names.push(name)
                    })
                    return names.join(',')
                }
            },{
                label : '更新时间',
                prop : 'updateTime',
                formatter(row,column,value){
                    return util.formatDate(new Date(value))
                }
            },{
                label : '创建时间',
                prop : 'createTime',
                formatter(row,column,value){
                    return util.formatDate(new Date(value))
                }
            }],
            roleForm : {
                roleName: '',
                remark : ''
            },
            roleList : [],
            rules: {
                roleName : [
                {
                    required : true,
                    message : '请输入角色名称',
                    trigger : 'blur'
                }]
            },
            showPermission : false,
            curRoleId : '',
            curRoleName : '',
            //菜单映射表
            actionMap : {}
        }
    },
    computed : {
        getMenu(){
            return this.$store.state.menuList
        }
    },
    mounted() {
        this.getRoleList()
        this.getMenulist()
    },
    methods: {
        async getRoleList(){
            try {
                let {list,page} = await this.$api.getRoleList({...this.queryForm,...this.pager})
                this.roleList = list
                this.pager.total = page.total
            } catch (error){
                throw new Error(error)
            }  
        },
        //获取菜单列表
        async getMenulist(){
            try {
                let list =  await this.$store.dispatch('queryMenuList')
                this.getActionMap(list)
            } catch (error){
                throw new Error(error)
            }  
        },
        //角色添加
        handleAdd(type,row){
            this.showModal = true
            this.action = 'create'
        },
        //表单重置
        handleReset(form){
            this.$refs[form].resetFields()
        }, 
        handleClose(){
            this.handleReset('dialogForm')
            this.showModal = false
        },
        handleSubmit(){
            this.$refs.dialogForm.validate(async (valid) => {
                if(valid){
                    let {roleForm,action} = this
                    let params = {...roleForm,action}
                    let res = await this.$api.roleOperate(params)
                    if(res){
                        this.showModal = false
                        this.$message.success('创建成功')
                        this.handleReset('dialogForm')
                        this.getRoleList()
                    }
                    
                }
            })
        },
        async handlePermissionSubmit(){
            let nodes = this.$refs.permissionTree.getCheckedNodes()
            let halfKeys = this.$refs.permissionTree.getHalfCheckedKeys()
            let checkedKeys = []
            let parentKeys = [] 
            nodes.map(node => {
                if(!node.children){
                    checkedKeys.push(node._id)
                }else{
                    parentKeys.push(node._id)
                }
            })

            let params = {
                _id :  this.curRoleId,
                permissionList : {
                    checkedKeys,
                    halfCheckedKeys : parentKeys.concat(halfKeys)
                }
            }
            let res = await this.$api.updatePermission(params)
            this.showPermission = false
            this.$message.success('设置成功')
            this.getRoleList()
        },
        //角色编辑
        handleEdit(row){
            this.showModal = true
            this.action = 'edit'
            this.$nextTick(() => {
                this.roleForm = {roleName : row.roleName,remark:row.remark}
            })
        },
        //角色删除
        async handleDel(_id){
            let res = await this.$api.roleOperate({_id,action:'delete'})
            this.$message.success('删除成功')
            this.getRoleList()
        },
        handleCurrentChange(current){
            this.pager.pageNum = current
            this.getRoleList() 
        },
        handleOpenPermission(row){
            this.curRoleId = row._id 
            this.curRoleName = row.roleName
            this.showPermission = true
            let {checkedKeys} = row.permissionList
            setTimeout(() => {
                this.$refs.permissionTree.setCheckedKeys(checkedKeys)
            })
        },
        getActionMap(list){
            let actionMap = {}
            const deep = (arr) => {
                while(arr.length){
                    let item = arr.pop()
                    if(item.children && item.action){
                        actionMap[item._id] = item.menuName
                    }
                    if(item.children && !item.action){
                        deep(item.children)
                    }
                }
            }
            deep(JSON.parse(JSON.stringify(list)))
            this.actionMap = actionMap
            console.log(this.actionMap)
        }
    }
}
</script>

<style lang="scss" scoped>
</style>