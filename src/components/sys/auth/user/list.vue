<template>
  <el-row>
    <el-row class="breadcrumb-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>你当前的位置</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in $route.matched" :key="item.href">{{item.meta.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-row class="search-container">
      <el-col :span="3">
        <el-input v-model="searchItem.nickname" placeholder="昵称"></el-input>
      </el-col>
      <el-col :span="3" class="ml15">
        <el-input v-model="searchItem.username" placeholder="用户名"></el-input>
      </el-col>
      <el-col :span="4" class="ml15">
        <el-button type="primary">搜索</el-button>
        <el-button  type="warning">清空</el-button>
      </el-col>
    </el-row>
    <el-row class="table-container">
      <el-row class="operate">
        <el-button type="success" icon="plus" @click="add">添加</el-button>
        <el-button type="warning" icon="edit" @click="update">修改</el-button>
        <el-button type="danger" icon="delete" @click="remove">删除</el-button>

      </el-row>
      <el-table max-height="450" stripe ref="multipleTable" :data="datas" border tooltip-effect="dark"
                style="width: 100%" v-loading="loading"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" width="80" label="序号"></el-table-column>
        <el-table-column prop="username" label="用户名" :sortable="true" width="120"></el-table-column>
        <el-table-column prop="nickname" label="昵称" :sortable="true" show-overflow-tooltip></el-table-column>
        <el-table-column prop="phone" label="电话" :sortable="true" show-overflow-tooltip></el-table-column>
        <el-table-column prop="email" label="邮箱" :sortable="true" show-overflow-tooltip></el-table-column>
        <el-table-column prop="gender" label="性别" :sortable="true" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status" label="状态" :sortable="true" show-overflow-tooltip></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="pager.page"
                       :page-sizes="pager.pageSizes" :page-size="pager.size"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="pager.total"></el-pagination>
      </div>
    </el-row>
    <el-row>
      <el-dialog :close-on-click-modal="false" :title="dialogName" :visible.sync="addDialogVisible">
        <el-form :model="item" ref="itemForm" label-width="100px" :rules="rules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="item.username"></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="item.nickname"></el-input>
          </el-form-item>
          <el-form-item required label="手机号" prop="phone">
            <el-input v-model="item.phone"></el-input>
          </el-form-item>
          <el-form-item required label="邮箱" prop="email">
            <el-input v-model="item.email"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="item.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="repassword">
            <el-input type="password" v-model="item.repassword"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="item.gender">
              <el-radio class="radio" :label="1">男</el-radio>
              <el-radio class="radio" :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch on-text="启用" off-text="禁用" on-color="#13ce66" off-color="#ff4949" :onValue="0" :offValue="1"
                       v-model="item.status"></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="ok('itemForm')">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
    <router-view></router-view>

  </el-row>
</template>
<script>
  import TableUtil from '@/components/basic/utils/table-util';
  import UserService from './UserService'
  import qs from 'qs';
  export default {
    data() {
      return {
        datas: [],
        sels: [],
        addDialogVisible: false,
        updateDialogVisible: false,
        dialogName: '',
        loading: false,
        item: {
          username: '',
          nickname: '',
          password: '',
          repassword: '',
          gender: 1,
          status: 0
        },
        pager: {
          size: 10,
          page: 1,
          pageSizes: [5, 10, 20, 50],
          total: 0
        },
        searchItem: {
          username: '',
          nickname: ''
        },
        rules: {
          nickname: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          username: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          phone: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          email: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          password: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
          repassword: [
            {required: true, message: '不能为空', trigger: 'change'}
          ],
        }
      };
    },
    methods: {
      add(){
        this.addDialogVisible = true;
        this.item = {username: '', nickname: '', password: '', repassword: '', gender: 1, status: 0};
        this.dialogName = '用户新增';
      },
      update(){
        if (TableUtil.hasOnlyOneRowSelected(this.sels)) {
          this.item = this.sels[0];
          this.dialogName = '用户编辑';
          this.$router.push({name:'userUpdate', params: { item:this.item}});
        }
      },
      ok(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post('/api/admin/user/add', qs.stringify(this.item), {}).then(res => {
              this.$message({message: '保存成功', type: 'success'});
              this.dialogVisible = false;
              this.page();
            });
          } else {
            return false;
          }
        });

      },
      page(){

        this.loading = true;
        this.axios.post('/api/admin/user/list', qs.stringify({
          page: this.pager.page,
          size: this.pager.size
        })).then(res => {
          this.datas = res.data.content;
          this.pager.total = res.data.totalElements;
          this.loading = false;
        });
      },
      remove(){
        if (TableUtil.hasMoreThanOneRowSelected(this.sels)) {
          this.$confirm('确定要删除么', '提示', {
            type: 'warning'
          }).then(() => {
            let ids = this.sels.map(item => item.id);
            this.axios.get('/api/admin/user/delete', {params: {ids: ids}}).then(res => {
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
