<template>
  <div class="login-box">
    <el-form ref="itemForm">
      <h4 class="title">系统登录</h4>
      <el-form-item>
        <el-input v-model="username" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" v-model="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-button type="primary" @click="ok" class="login-btn">登 录</el-button>
    </el-form>
  </div>
</template>

<script>
  import qs from 'qs';
  export default {
    name: 'test',
    data () {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      ok(){
        this.axios.post('/api/admin/login', qs.stringify({username: this.username, password: this.password})).then(res => {
          if (res.data.code === 0) {
            sessionStorage.setItem('loginUser', qs.stringify(res.data.object));
            this.$router.push('/admin')
          } else {
            this.$message.error(res.data.message);
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login-box {
    border: 1px solid #eaeaea;
    padding: 15px 35px 35px 35px;
    margin: 180px auto;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    box-shadow: 0 0 25px #cac6c6;
    width: 350px;
    overflow: hidden;

  }

  .title {
    text-align: center;
    padding-bottom: 20px;
  }

  .login-btn {
    float: right;
    margin-top: 20px;
  }

</style>
