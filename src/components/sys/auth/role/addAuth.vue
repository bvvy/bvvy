<template>
  <el-dialog :close-on-click-modal="loseFocusClose" :title="dialogName" @close="close" :visible.sync="dialogVisible">

    <el-tree
      :data="trees"
      show-checkbox
      node-key="id"
      ref="menuTree"
      defaultExpandAll
      check-strictly
      :default-checked-keys="selKeys">
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import qs from 'qs';
  export default {
    data(){
      return {
        loseFocusClose: false,
        dialogName: '分配权限',
        dialogVisible: true,
        trees: [],
        selKeys: [],
      };
    },
    methods: {
      getTree(){
        this.axios.post('/api/admin/menu/tree').then(res => this.trees = res.data.children);
        this.axios.post(`/api/admin/role/${this.$route.params.id}/auths`).then(res => {
           this.$refs.menuTree.setCheckedKeys(res.data)
        });
      },
      ok(){
        const id = this.$route.params.id;
        console.log(this.$refs.menuTree.getCheckedKeys());

        this.axios.get(`/api/admin/role/${id}/addAuth`, {params:{mIds:this.$refs.menuTree.getCheckedKeys()}}).then(res => {
          this.$message({
            type: 'success',
            message: res.data.message
          });
          this.dialogVisible = false;
        })
      },
      close(){
        this.$router.replace("/admin/role");
      }
    },
    mounted(){
      this.getTree();
    }
  }

</script>
