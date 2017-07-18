<template>
  <div>
    <el-row>
      <el-col :span="24" class="header light-gray">
        <el-col :span="4" class="logo">
          <el-col :span="6" :offset="6" class="text-center"><img src="../../assets/logo.png"/></el-col>
          <el-col :span="6" class="text-center">BVVY</el-col>
        </el-col>
        <el-col :span="4" :offset="16">
          <el-dropdown trigger="hover" class="text-center" menu-align="start">
            <span class="el-dropdown-link">{{loginUser.nickname}}<i
              class="el-icon-caret-bottom el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人资料</el-dropdown-item>
              <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!--<el-col class="text-center" ><el-button @click="login">登录</el-button></el-col>-->
        </el-col>
      </el-col>
    </el-row>
    <el-row class="tac">
      <el-col :span="4" class="left-menu">
        <el-menu default-active="2" router class="el-menu-vertical-demo">
          <el-submenu :index="lm.parent.href" v-for="lm in leftMenus" :key="lm.parent.id">
            <template slot="title"><i class="el-icon-message"></i>{{lm.parent.label}}</template>
            <el-menu-item v-for="child in lm.childs" :index="child.href" :key="child.id">{{child.label}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col :span="20" class="content">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import qs from 'qs'
  export default {
    data(){
      return {
        leftMenus: [],
        loginUser: {}
      };
    },
    methods: {
      listLeftMenu(){
        let loginUser = qs.parse(sessionStorage.getItem('loginUser'));
        this.axios.all([this.axios.post('/api/admin/menu/leftMenus'), this.axios.post(`/api/admin/user/${loginUser.id}/menus`)])
          .then(this.axios.spread((leftMenus, userMenus) => {
            let tLeftMenus = leftMenus.data;
            let tUserMenus = userMenus.data;
            tLeftMenus.forEach((lm, i) => {
              if(tUserMenus.includes(lm.parent.id)) {
                this.leftMenus.push({parent: lm.parent, childs: []});
              }
              lm.childs.forEach((child) => {
                  if(tUserMenus.includes(child.id)) {
                    this.leftMenus[i].childs.push(child);
                  }
              })
            })
          }));
      },
      logout(){
        sessionStorage.removeItem('loginUser');
        this.$router.push('/admin/login');
      }
    },
    mounted(){
      this.listLeftMenu();
      this.loginUser = qs.parse(sessionStorage.getItem('loginUser'));


    }
  }
</script>

<style>

  body {
    margin: 0;
    padding: 0;
  }

  #app {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }

  .text-center {
    position: relative;
    top: 50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
  }

  .header {
    min-height: 60px;
  }

  .header > * {
    height: 60px;
  }

  .light-gray {
    background: #E5E9F2;
  }

  .logo {
    height: 60px;
    border-right: 1px solid white;
  }

  .logo img {
    height: 40px;
  }

  .left-menu {
    border-right: 1px solid #fff;
  }

  .content {
    padding: 10px;
  }

  .ml15 {
    margin-left: 15px;
  }

  .mt15 {
    margin-top: 15px;
  }

</style>
