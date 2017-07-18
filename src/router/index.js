import Vue from 'vue'
import Router from 'vue-router'
import Test from '@/components/test/Test'
import Hello from '@/components/Hello'
import Admin from '@/components/sys/index'
import User from '@/components/sys/auth/user/list';

import UserUpdate from '@/components/sys/auth/user/update';
import Role from '@/components/sys/auth/role/list';
import AddRoleAuth from '@/components/sys/auth/role/addAuth';
import Menu from '@/components/sys/auth/menu/list';
import AddMenuChild from '@/components/sys/auth/menu/addChild'
import Front from '@/components/front/index';
import AdminLogin from '@/components/sys/adminLogin.vue'

Vue.use(Router);


const router = new Router({
  mode: 'history',
  routes: [
    {path: '/', component: Front, name: 'front', meta: {label: ''}},
    {path: '/test', component: Test, name: 'test'},
    {path: '/hello', component: Hello, name: 'hello'},
    {path: '/admin/login', component: AdminLogin},
    {
      path: '/admin', component: Admin, name: 'admin', meta: {label: '系统管理'}, children: [

      {
        path: '/admin/user', component: User, name: "user", meta: {label: "用户管理"}, children: [
        {path: '/admin/user/update', component: UserUpdate, name: 'userUpdate'}
      ]
      },
      {
        path: 'role', component: Role, name: "role", meta: {label: "角色管理"}, children: [
        {path: '/admin/role/:id/addAuth', component: AddRoleAuth}
      ]
      },
      {
        path: 'menu', component: Menu, name: "menu", meta: {label: "菜单管理"}, children: [
        {path: ':pid/addChild', component: AddMenuChild, meta: {label: "添加子菜单"}}
      ]
      }
    ]
    },
  ]
});
router.beforeEach((to,from,next)=>{
  console.log(to.fullPath);
  console.log(to.fullPath.startsWith('/admin')&& !to.fullPath.endsWith('login') && !to.fullPath.endsWith('logout'))
  if(to.fullPath.startsWith('/admin')&& !to.fullPath.endsWith('login') && !to.fullPath.endsWith('logout')) {
    if(sessionStorage.getItem('loginUser')) {
      next();
    } else {
      next('/admin/login');
    }
  } else{
    next()
  }
});
export default router;
