/**
 * Created by bvvy on 2017/5/17.
 */
import axios from 'axios'
export default{
  list(param) {
    console.log(param);
    return axios.get('/api/admin/user/page', param);
  },

}
