<template>
    <div class="query-form">
        <el-form ref="form" :inline="true" :model="queryForm">
            <el-form-item label="菜单名称" prop="menuName">
                <el-input v-model="queryForm.menuName" placeholder="请输入菜单ID"></el-input>
            </el-form-item>
            <el-form-item label="菜单状态" prop="menuState">
                <el-select v-model="queryForm.menuState">
                    <el-option :value="1" label="正常"></el-option>
                    <el-option :value="2" label="停用"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getMenuList">查询</el-button>
                <el-button @click="handleReset('form')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
    <div class="base-table">
        <div class="action">
            <el-button type="primary" @click="handleAdd(1)">新增</el-button>
        </div>
        <el-table :data="menuList" row-key="_id" :tree-props="{children:'children'}">
            <el-table-column
                v-for="item in columns"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :formatter="item.formatter"
            />
            <el-table-column label="操作" width="220">
                <template #default="scope">
                    <el-button type="primary" size="mini" @click="handleAdd(2,scope.row)">新增</el-button>
                    <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="handleDel(scope.row._id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="drag" v-drag>
        <el-dialog title="菜单新增" v-model="showModal" :before-close="handleClose">
        <el-form
            ref="dialogForm"
            :model="menuForm"
            label-width="100px"
            :rules="rules"
        >
            <el-form-item label="父级菜单" prop="parentId">
            <el-cascader 
                v-model="menuForm.parentId" 
                :options="menuList"
                :props="{checkStrictly:true,value:'_id',label:'menuName'}"
                />
                <span>    不选，则直接创建一级菜单</span>
            </el-form-item>
            <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="menuForm.menuType">
                <el-radio :label="1">菜单</el-radio>
                <el-radio :label="2">按钮</el-radio>
            </el-radio-group>
            </el-form-item>
            <el-form-item label="菜单名称" prop="menuName" >
            <el-input
                v-model="menuForm.menuName"
                placeholder="请输入菜单名称"
            ></el-input>
            </el-form-item>
            <el-form-item label="菜单图标" prop="icon" v-show="menuForm.menuType==1">
            <el-input v-model="menuForm.icon" placeholder="请输入岗位"></el-input>
            </el-form-item>
            <el-form-item label="路由地址" prop="path" v-show="menuForm.menuType==1">
            <el-input v-model="menuForm.path" placeholder="请输入路由地址"></el-input>
            </el-form-item>
            <el-form-item label="权限标识" prop="menuCode" v-show="menuForm.menuType==2">
            <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识"></el-input>
            </el-form-item>
            <el-form-item label="组件路径" prop="menuCode" v-show="menuForm.menuType==1">
            <el-input v-model="menuForm.component" placeholder="请输入组件路径"></el-input>
            </el-form-item>
            <el-form-item label="菜单状态" prop="menuState" v-show="menuForm.menuType==1">
            <el-radio-group v-model="menuForm.menuState">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="2">停用</el-radio>
            </el-radio-group>
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
</template>

<script>
import util from '../utils/utils'
export default {
    name: 'menu',
    data() {
        return {
            queryForm : {
                menuName : '',
                menuState : 1
            },
            menuForm : {
                parentId : [null],
                menuType : 1,
                menuName : '',
                icon : '',
                path : '',
                menuCode : '',
                component : '',
                menuState : 1
            },
            menuList : [],
            showModal : false,
            action : '',
            columns : [{
                label : '菜单名称',
                prop : 'menuName'
            },{
                label : '图标',
                prop : 'icon'
            },{
                label : '菜单类型',
                prop : 'menuType',
                formatter(row,column,value){
                    return {
                        1:'菜单',
                        2:'按钮'
                    }[value]
                }
            },{
                label : '权限标识',
                prop : 'menuCode'
            },{
                label : '路由地址',
                prop : 'path'
            },{
                label : '组件路径',
                prop : 'component'
            },{
                label : '菜单状态',
                prop : 'menuState',
                width : '90',
                formatter(row,column,value){
                    return {
                        1:'正常',
                        2:'停用'
                    }[value]
                }
            },{
                label : '创建时间',
                prop : 'createTime',
                formatter(row,column,value){
                    return util.formatDate(new Date(value))
                }
            }],
            rules: {
                menuName : [
                {
                    required : true,
                    message : '请输入菜单名称',
                    trigger : 'blur'
                },
                {
                    min : 2,
                    max : 10,
                    message : '长度在2-8个字符',
                    trigger : 'blur'
                }]
            }
        }
    },
    mounted() {
        this.getMenuList()
    },
    methods: {
        async getMenuList(){
            try {
                let list = await this.$api.getMenuList(this.queryForm)
                this.menuList = list
            } catch (Error){
                throw new Error
            }  
        },
        handleAdd(type,row){
            this.showModal = true
            this.action = 'add'
            if(type === 2){
              this.menuForm.parentId = [...row.parentId,row._id].filter((item) => item)
            }
        },
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
                    let {action,menuForm} = this
                    let params = {...menuForm,action}
                    let res = await this.$api.menuSubmit(params)
                    this.showModal = false
                    this.$message.success('操作成功')
                    this.handleReset('dialogForm')
                    this.getMenuList()
                }
            })
        },
        handleEdit(row){
            this.showModal = true
            this.action = 'edit'
            this.menuForm = row
            this.$nextTick(() => {
                Object.assign(this.menuForm,row)
            })
        },
        async handleDel(id){
            let res = await this.$api.menuSubmit({id,action:'delete'})
            this.$message.success('删除成功')
            this.getMenuList()
        },
    }
}
</script>

<style lang="scss" scoped>
</style>