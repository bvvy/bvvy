<template>
  <el-row>
    <router-view></router-view>
    <el-row class="breadcrumb-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>你当前的位置</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in $route.matched" :key="item.href">{{item.meta.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="search-container">
      <el-col :span="3">
        <el-input v-model="searchItem.name" placeholder="名称"></el-input>
      </el-col>

      <el-col :span="4" class="ml15">
        <el-button type="primary">搜索</el-button>
        <el-button type="warning">清空</el-button>
      </el-col>
    </el-row>
    <el-row class="table-container">
      <el-row class="operate">
        <el-button type="success" icon="plus" @click="add">添加</el-button>
        <el-button type="warning" icon="edit" @click="update">修改</el-button>
        <el-button type="danger" icon="delete" @click="batchDel">删除</el-button>
        <el-button type="info" icon="setting" @click="addUsers">分配用户</el-button>
        <el-button type="info" icon="setting" @click="addAuth">分配菜单权限</el-button>

      </el-row>
      <el-table max-height="450" stripe ref="multipleTable" :data="datas" border tooltip-effect="dark"
                style="width: 100%" v-loading="loading"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="80" label="序号"></el-table-column>
        <el-table-column prop="name" label="名称" :sortable="true" width="120"></el-table-column>
        <el-table-column prop="sn" label="sn" :sortable="true" show-overflow-tooltip></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="pager.page"
                       :page-sizes="pager.pageSizes" :page-size="pager.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="pager.total"></el-pagination>
      </div>
    </el-row>
    <el-dialog :close-on-click-modal="false" :title="dialogName" :visible.sync="saveDialogVisible">
      <el-form :model="item" ref="itemForm" label-width="100px" :rules="rules">
        <el-form-item label="名称" prop="nickname">
          <el-input v-model="item.name"></el-input>
        </el-form-item>
        <el-form-item label="sn" prop="nickname">
          <el-input v-model="item.sn"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="saveDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok('itemForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :title="dialogName" :visible.sync="addUsersDialogVisible">
      <el-row>
        <el-col :span="18" :offset="3">
          <el-transfer
            v-model="roleUsers"
            filterable
            :props="{
            key: 'id',
            label: 'nickname'
         }"
            :titles="['未分配', '已分配']"
            :button-texts="['取消分配', '分配']"

            :footer-format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
        }"

            :data="users">
            <el-button class="transfer-footer" slot="left-footer" size="small">操作</el-button>
            <el-button class="transfer-footer" slot="right-footer" size="small">操作</el-button>
          </el-transfer>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUsersDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignOk()">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
  import TableUtil from '@/components/basic/utils/table-util';
  import qs from 'qs';
  export default {
    data() {
      return {
        datas: [],
        sels: [],
        saveDialogVisible: false,
        addUsersDialogVisible: false,
        dialogName: '',
        loading: false,
        item: {
          name: '',
          sn: '',
        },
        pager: {
          size: 10,
          page: 1,
          pageSizes: [5, 10, 20, 50],
          total: 0
        },
        searchItem: {
          name: '',
        },
        rules: {
          name: [
            {required: true, message: '不能为空', trigger: 'change'}
          ]
        },
        users: [],
        roleUsers: []
      };
    },
    methods: {
      page(){
        this.loading = true;
        this.axios.post('/api/admin/role/list', qs.stringify({
          page: this.pager.page,
          size: this.pager.size
        })).then(res => {
          this.datas = res.data.content;
          this.pager.total = res.data.totalElements;
          this.loading = false;
        });
      },
      add(){
        this.saveDialogVisible = true;
        this.item = {name: '', sn: ''};
        this.dialogName = '角色新增';
      },
      update(){
        if (TableUtil.hasOnlyOneRowSelected(this.sels)) {
          this.saveDialogVisible = true;
          this.item = this.sels[0];
          this.dialogName = '角色编辑';
        }
      },
      batchDel(){
        if (TableUtil.hasMoreThanOneRowSelected(this.sels)) {
          this.$confirm('确定要删除么', '提示', {
            type: 'warning'
          }).then(() => {
            let ids = this.sels.map(item => item.id);
            this.axios.get('/api/admin/role/delete', {params: {ids: ids}}).then(res => {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.page();
            }).catch(e => {
            });
          })
        }
      },
      addUsers(){
        if (TableUtil.hasOnlyOneRowSelected(this.sels)) {
          this.addUsersDialogVisible = true;
          this.item = this.sels[0];
          this.dialogName = '分配' + this.item.name + '用户';
          this.getUsers();
          this.getRoleUsers();
        }
      },
      addAuth(){
        if (TableUtil.hasOnlyOneRowSelected(this.sels)) {
          this.item = this.sels[0];
          this.$router.push(`/admin/role/${this.item.id}/addAuth`);
        }
      },
      getUsers(){
        this.axios.post('/api/admin/user/list', qs.stringify({page: 1, size: 15})).then(res => {
          this.users = res.data.content;
        })
      },
      getRoleUsers(){
        this.axios.post(`/api/admin/role/${this.item.id}/users`).then(res => {
          this.roleUsers = res.data.map(d => d.id);
        })
      },
      assignOk(){
        this.axios.get(`/api/admin/role/${this.item.id}/addUsers`, {
          params: {userIds: this.roleUsers}
        }).then(res => {
          this.$message({message: res.data.message, type: 'success'});
          this.addUsersDialogVisible = false;
        })
      },
      ok(formName) {

        this.$refs[formName].validate((valid) => {
          if (valid) {

            this.axios.post('/api/admin/role/add', qs.stringify(this.item), {}).then(res => {
              this.$message({message: '保存成功', type: 'success'});
              this.saveDialogVisible = false;
              this.page();
            });
          } else {
            return false;
          }
        });

      },

      handleSelectionChange(sels) {
        this.sels = sels;
      },
      handleCurrentChange(val) {
        this.pager.page = val;
        this.page();
      },
      handleSizeChange(val) {
        this.pager.size = val;
        this.page();
      }
    },
    mounted(){
      this.page();
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .operate {
    font-size: 16px;
  }

  .breadcrumb-container {
    padding: 10px;
  }

  .search-container {
    padding: 10px;
  }

  .table-container {
    padding: 10px;
  }
</style>
