<template>
  <el-row>
    <router-view></router-view>
    <el-row class="breadcrumb-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>你当前的位置</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in $route.matched" :key="item.href">{{item.meta.label}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <el-col :span="6">
      <el-tree :data="trees" @node-click="nodeClick" :expand-on-click-node="false" highlight-current default-expand-all
               node-key="id"></el-tree>
    </el-col>
    <el-col class="menu-form" :span="18" v-if="formVisible">
      <el-row class="operate-box">
        <el-button type="success" icon="plus" @click="$router.push(`/admin/menu/${node.id}/addChild`)">添加下级菜单
        </el-button>
        <el-button type="danger" icon="plus" @click="remove">删除菜单</el-button>
      </el-row>
      <el-form ref="form" align="center" :model="node" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="node.label"></el-input>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="node.href"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="node.icon"></el-input>
        </el-form-item>
        <el-form-item label="菜单位置">
          <el-input v-model="node.menuPos"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-input v-model="node.display"></el-input>
        </el-form-item>
        <el-button type="success">确认</el-button>
        <el-button type="primary">重置</el-button>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    data() {
      return {
        trees: [],
        node: {},
        formVisible: false
      };
    },
    methods: {
      getTree(){
        this.axios.post('/api/admin/menu/tree').then(res => {
          this.trees = res.data.children;
          console.log(res.data.children)
        });
      },
      nodeClick(data){
        this.axios.post(`/api/admin/menu/${data.id}`).then(res => {
          this.node = res.data;
          this.formVisible = true;
        });
      },
      remove(){
          this.$confirm('确定要删除么', '提示', {
            type: 'warning'
          }).then(()=>{
            this.axios.get(`/api/admin/menu/delete`,{params:{ids:[this.node.id]}}).then(res=>{
              this.getTree();
            });
          })
      },
      admin(name){
        alert(name);
      }
    },
    mounted(){
      this.getTree();
    }
  };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .breadcrumb-container {
    padding: 10px;
  }

  .menu-form {
  }
</style>
