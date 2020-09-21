import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { axios } from '@/libs/axios'
import { serveUrl } from '@/libs/config'
import {
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Pagination,
  Form,
  FormItem,
  Row,
  Col,
  Upload,
  Loading,
  MessageBox,
  Message,
} from 'element-ui';

import './styles/index.scss'

Vue.prototype.$message = Message
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;

Vue.prototype.$http = axios
Vue.prototype.$serveUrl = serveUrl

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
