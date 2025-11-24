# transform

---
description: 基于项目模板的开发规则
globs: src/**/*
alwaysApply: false
---

# react2vue
1.将所选的目录或者文件转换为vue3的组件代码，我的vue版本是3.5
2.当遇到PortalToFollowElem、PortalToFollowElemTrigger、PortalToFollowElemContent时使用el-popover替代，PortalToFollowElem对应el-popover，PortalToFollowElemTrigger对应reference插槽，PortalToFollowElemContent对应默认插槽，需要设置teleported为true、persistent为false，show-arrow为false，popper-class为custom-popover，同时注意offset、position等属性的对齐
3.react-i18n需要替换为vue-i18n
4.对于不存在的文件引用无视文件是否存在,不要创建所选目录外的文件
5.对于TipPopup组件替换为el-tooltip组件
6.对于引入的toast组件替换为el-notication组件
7.对于ReactSortable这一层拖拽排序的组件不需要，转换时将相关代码删除
8.尝试将引用不存在的基础组件，如Button、Seleect等，通常引用路径为@/app/component/base，使用element-plus的组件代替,替换后需要注释原先的组件代码使用信息，对于复杂自定义组件不进行替换尝试
9.input-support-select-var这一组件改为引用@/components/workflow/tiptap-editor/tiptap.vue