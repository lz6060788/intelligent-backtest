# transform

---
description: 基于项目模板的开发规则
globs: src/**/*
alwaysApply: false
---

# react2vue
1.将所选的目录或者文件转换为vue3的组件代码，我的vue版本是3.5
2.当遇到button、select等源代码位于app/component/base目录下的基础组件，尝试使用element-plus的组件替代。
3.当遇到PortalToFollowElem、PortalToFollowElemTrigger、PortalToFollowElemContent时使用el-popover替代，PortalToFollowElem对应el-popover，PortalToFollowElemTrigger对应reference插槽，PortalToFollowElemContent对应默认插槽，需要设置teleported为true、persistent为false，show-arrow为false，popper-class为custom-popover，同时注意offset、position等属性的对齐
4.react-i18n需要替换为vue-i18n
5.对于不存在的文件引用无视文件是否存在
6.对于TipPopup组件替换为el-tooltip组件