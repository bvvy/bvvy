<template>
  <el-dialog :close-on-click-modal="false" :title="dialogName" @close="close" :visible.sync="dialogVisible">
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
      <el-button @click="updateDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="ok('itemForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import qs from 'qs';
  export default {
    data() {
      return {
        dialogName: '更新',
        dialogVisible: true,
        item: {
          username: '',
          nickname: '',
          gender: 1,
          status: 0
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
        }
      };
    },
    methods: {
      ok(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post('/api/admin/user/update', qs.stringify(this.item), {}).then(res => {
              this.$message({message: res.data.message, type: 'success'});
              this.dialogVisible = false;
            });
          } else {
            return false;
          }
        });
      },
      getParam(){
        this.item = this.$route.params.item;
      },
      close(){
        this.$router.go(-1);
      }
    },
    mounted(){
      this.getParam();
    }
  }
</script>
