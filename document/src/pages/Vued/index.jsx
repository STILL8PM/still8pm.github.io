import React from 'react'
import { Layout, Menu } from 'antd';

const { Sider, Content } = Layout;
const { SubMenu } = Menu;

// submenu keys of first level
const rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];

const Vued = () => {
    const [openKeys, setOpenKeys] = React.useState(['sub1']);
    const onOpenChange = keys => {
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };
    const list = {
        vue_basic: ['01_初识Vue', '02_Vue模板语法', '03_数据绑定', '04_el与data的两种写法', '05_MVVM模型', '06_数据代理', '07_事件处理', '08_计算属性', '09_监视属性', '10_绑定样式', '11_条件渲染', '12_列表渲染', '13_收集表单数据', '14_过滤器', '15_内置指令', '16_自定义指令', '17_生命周期', '18_非单文件组件', '19_单文件组件'],
        vue_test: ['01_src_分析脚手架', '02_src_ref)属性', '03_src_props配置', '04_src_mixin混入（合）', '05_src_插件', '06_src_scoped样式', '07_src_TodoList案例', '08_src_浏览器本地存储', '09_src_TodoList本地存情', '10_src_组件自定义事件', '11_src_TodoList自定义事件', '12_src_全局事件总线', '13_src_TodoList事件总线', '14_src_消息订阅与发布', '15_src_TodoList_pubsub', '16_src_TodoList_nextTick', '17_src_过渡与动画', '18_src_TodoList动画', '19_src_配置代里服务器', '20_src_github搜索案例', '21_src_github搜索案例_vue-resource', '22插槽1_src_默认插槽', '22插槽2_src_具名插槽', '22插槽3_src_作用域插槽', '23_src_求和案例纯vue版', '24_src_求和案例_vuex版', '25_src_求和案例_getters',],
        vue3_test: [],
        vue3_test_vite: []
    }
    return (

        <Layout>
            <Sider>
                <Menu mode="inline" openKeys={openKeys} onOpenChange={onOpenChange} style={{ width: 200 }}>
                    <SubMenu key="sub1" title="vue_basic">
                        {
                            Object.values(list)[0].map((v, i) => {
                                return <Menu.Item key={'sub1' + i}>{v}</Menu.Item>
                            })
                        }
                    </SubMenu>
                    <SubMenu key="sub2" title="vue3_test">
                        {
                            Object.values(list)[1].map((v, i) => {
                                return <Menu.Item key={'sub2' + i}>{v}</Menu.Item>
                            })
                        }
                    </SubMenu>
                    <SubMenu key="sub3" title="vue3_test">
                        {
                            Object.values(list)[2].map((v, i) => {
                                return <Menu.Item key={'sub3' + i}>{v}</Menu.Item>
                            })
                        }
                    </SubMenu>
                    <SubMenu key="sub4" title="vue3_test_vite">
                        {
                            Object.values(list)[3].map((v, i) => {
                                return <Menu.Item key={i}>{v}</Menu.Item>
                            })
                        }
                    </SubMenu>
                </Menu>
            </Sider>
            <Content>

            </Content>
        </Layout>

    );
};
export default Vued
