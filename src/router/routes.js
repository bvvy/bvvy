/**
 * Created by ASUS on 2017/5/26.
 */
import axios from 'axios';

export default {
  getRoutes(){
    return axios.post('url', {userId: '1'});
  }
}
