# transform

---
description: 基于项目模板的开发规则
globs: src/**/*
alwaysApply: false
---

# react2vue
1.我的vue版本是vue3.5。
2.当遇到button、select等源代码位于app/component/base目录下的基础组件，尝试使用element-plus的组件替代。
3.当遇到PortalToFollowElem、PortalToFollowElemTrigger、PortalToFollowElemContent时使用el-popover替代，PortalToFollowElem对应el-popover，PortalToFollowElemTrigger对应reference插槽，PortalToFollowElemContent对应默认插槽，需要设置teleported为true、persistent为false，show-arrow为false，popper-class为custom-popover，同时注意offset、position等属性的对齐
