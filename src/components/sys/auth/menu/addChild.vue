<template>
  <el-dialog :close-on-click-modal="loseFocusClose" :title="dialogName" @close="close" :visible.sync="dialogVisible">
    <el-form :model="item" ref="itemForm" label-width="100px" :rules="rules">
      <el-form-item label="名称">
        <el-input v-model="item.label"></el-input>
      </el-form-item>
      <el-form-item label="链接">
        <el-input v-model="item.href"></el-input>
      </el-form-item>
      <el-form-item label="图标">
        <el-input v-model="item.icon"></el-input>
      </el-form-item>
      <el-form-item label="菜单位置">
        <el-input v-model="item.menuPos"></el-input>
      </el-form-item>
      <el-form-item label="显示">
        <el-switch on-text="显示" :width="75" off-text="不显示" on-color="#13ce66" off-color="#ff4949" :onValue="1"
                   :offValue="0"
                   v-model="item.display"></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import ElForm from "../../../../../node_modules/element-ui/packages/form/src/form";
  import qs from 'qs';
  export default {
    components: {ElForm},
    data(){
      return {
        loseFocusClose: false,
        dialogName: '添加子菜单',
        dialogVisible: true,
        item: {
          display: 1,
          label:'',
          href:'',
          icon:'',
          menuPos:0
        },
        rules: {}

      };
    },
    methods: {
      ok(){
        let pid = this.$route.params.pid;
        this.axios.post(`/api/admin/menu/${pid}/addChild`, qs.stringify(this.item)).then(res => {
          this.$message({
            type: 'success',
            message: res.data.message
          });
          this.dialogVisible = false;
        })
      },
      close(){
        this.$router.replace("/admin/menu");
      }
    }
  }

</script>
