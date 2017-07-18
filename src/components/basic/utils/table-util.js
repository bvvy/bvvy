/**
 * Created by bvvy on 2017/5/17.
 */
import { Message } from 'element-ui';
export default {
  hasOnlyOneRowSelected(data) {
    if(data.length===1) return true;
    else {
      Message('你只能选择一条记录');
    }
  },
  hasMoreThanOneRowSelected(data){
    if(data.length<1) {
      Message('请选择一条记录');
    }else return true;
  }
}
