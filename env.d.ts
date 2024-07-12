/// <reference types="vite/client" />
// 下划线报红问题解决
declare module "*.vue" {
    import { DefineComponent } from "vue"
    const component: DefineComponent<{}, {}, any>
    export default component
}