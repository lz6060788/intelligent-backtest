### 项目简介

该项目由开源项目[dify](https://github.com/langgenius/dify/tree/main/web)移植而来。为适配当前团队内的技术栈和需要，抽取了`dify`中前端工作流部分的核心代码进行迁移修改。`dify`是基于`react`框架开发的，而当前项目则改为了基于`vue3`开发。在此基础上同样进行了如`UI`库这样的依赖进行的替换。



#### 一、UI相关

##### 1.关于UI库

在`dify`中，它大量使用了自主开发的组件（可能为`shadcn/ui `）具体未考究。而在当前项目中，出于快速开发与技术验证演示的需要，将大量组件替换为了`Element-plus`。这导致了组件样式、主题色与项目并不匹配（当前使用了默认`Element-plus`暗色主题）。后期若要美化，建议替换为无头UI库进行改进。

##### 2.关于主题色

由于没有设计的参与以及开发工期的问题，当前项目是主题色缺失的状态，且没有为项目添加主题色切换相关的`hook`，保留了一些定义和工具函数，需要后期设计主题色、建立主题色变量进行关联以及应用主题色，这与上一条`UI`库也有巨大关联，工作量较大。

##### 3.关于图标库

当前项目直接迁移了`dify`项目中的图标，初次启动需要运行脚本生成图标。

```bash
npm run generate:icons
```

除此之外，项目中还使用了其他图标库：

- `@heroicons/vue`
- `@remixicon/vue`
- `element-plus/icon`

后期建议采用自行设计的图标库。

##### 4.关于编辑器

`dify`中使用的是`@lexical`，该库没有`vue`版本，因此在当前项目中使用的`tiptap`，目前实现了几乎同等效果的`@`提示选择效果。

具体参考：`src\components\workflow\tiptap-editor`中关于`suggestion`部分。

当然在`dify`中不同类型的提示似乎定义了多个插件，这后续可能需要开发选中节点的样式等。



------



### 二、功能

##### 1.节点与边

几乎类同与`dify`，使用了[vueflow](https://vueflow.dev/)这一库进行了几乎完全的迁移。目录结构、程序设计在这一层次下几乎照搬了`dify`，对比两边会发现十分相似。`workflow`的绝大多数节点或边的事件都进行了拦截以及处理，以供自定义实现业务需要。

`vueflow`交互相关（拖拽、连接、添加删除等等）的主要内容，都定义在了以下几个hook文件之中：

```
src\components\workflow\hooks\use-edge-interactions.ts
src\components\workflow\hooks\use-node-interactions.ts
src\components\workflow\hooks\use-workflow-interactions.ts
```



**节点内容**

> `loop-start`和`iteration-start`是两个特殊类型节点，他们的节点类型是独立的。

- 节点面板(`index.vue`)

这一部分是流程图中各节点内部显示控制，在每个节点外层都会再包一层`baseNode`用于统一样式。

- 属性面板(`panel.vue`)

这一部分是节点属性设置的面板，绝大多数与`dify`面板类似，或者进行了简化

- 元属性(`default.ts`)

这一部分定义了节点的元属性（如节点类型、是否是必要的、能否删除等）与初始值。

- 类型定义(`type.ts`)

这一部分定义了节点的属性类型

- 属性操作集合(`use-config.ts`)

这一部分**大量使用了深拷贝替换了原`dify`中的`immer`库**，原因是`immer`库内部似乎会有冻结操作造成响应式的破坏。实际上由于`vue`的响应式能力，不使用深拷贝应该也是可以的（这一点在上述的交互`hook`中也存在），不过好处是属性设置通过`setInputs`这一`hook`方法进行了拆分，方便后续拓展（`dify`中加了保存草稿的能力，当前注释了）

> 当前其余内容如单节点调试相关内容、单节点调试面板是缺失的，未进行迁移



**节点的基础类型**

所有以`_`开头的属性都是流程图系统内部使用，对于系统外是无用的

```typescript
export type CommonNodeType<T = {}> = {
  // 这是节点的连接关系存储，使用上述交互方法会自动设置这一部分
  _connectedSourceHandleIds?: string[]
  _connectedTargetHandleIds?: string[]
  _targetBranches?: Branch[]
    
  // 由于当前没有单节点调试，当前下面几个属性是暂时无用的
  _isSingleRun?: boolean
  _runningStatus?: NodeRunningStatus
  _runningBranchId?: string
  _singleRunningStatus?: NodeRunningStatus
    
  // 以下部分也是用于交互的
  _isCandidate?: boolean
  _isBundled?: boolean
  _children?: { nodeId: string; nodeType: BlockEnum }[]
  _isEntering?: boolean
  selected?: boolean
  _dimmed?: boolean
    
  // 这是用于变量聚合自动弹出弹窗，这一功能当前删除了
  // _showAddVariablePopup?: boolean
  // _holdAddVariablePopup?: boolean
    
  // 迭代、循环相关
  isInIteration?: boolean
  iteration_id?: string
  _iterationLength?: number
  _iterationIndex?: number
  _waitingRun?: boolean
  _loopLength?: number
  _loopIndex?: number
  isInLoop?: boolean
  loop_id?: string
    
  // 重试以及重试策略当前各节点都进行了屏蔽，这几个属性也暂时无用
  _retryIndex?: number
  error_strategy?: ErrorHandleTypeEnum
  retry_config?: WorkflowRetryConfig

  _isTempNode?: boolean
    
  // 这些属性都是在元属性中设置的
  title: string
  desc: string
  type: BlockEnum
    
  width?: number
  height?: number
  position?: XYPosition
  default_value?: DefaultValueForm[]
  credential_id?: string
   
  // 新增属性，表示是否为算子流的节点
  _isBelongToCalculator?: boolean
  // 新增属性，表示拖拽节点将要进入该节点（拓展了拖拽节点至循环、迭代节点的功能）
  _isWillDragEnter?: boolean
} & T;
```



**边的基础类型**

```typescript
export type CommonEdgeType = {
  // 基本都是交互相关的
  _hovering?: boolean
  _connectedNodeIsHovering?: boolean
  _connectedNodeIsSelected?: boolean
  _isBundled?: boolean
  _waitingRun?: boolean
  isInIteration?: boolean
  iteration_id?: string
  isInLoop?: boolean
  loop_id?: string
  sourceType: BlockEnum
  targetType: BlockEnum,
  _isTemp?: boolean,
}
```



##### 2.关于节点变量传递

核心`hook`位于`src\components\workflow\hooks\use-workflow-variables.ts`

主要工具函数实现位于`@/components/workflow/nodes/_base/variable/utils`，这一文件内具体定义了每个节点的变量输出、变量输出类型、变量引用、变量引用更新等具体的方法。



- 由于当前没有单节点调试与环境变量的设置，因此**`environmentVariables`**这一部分当前一定是空的

- 由于当前的设计中不存在对话模式（应该未来也不会存在），因此**`conversationVariables`**一定是空的

- 由于当前并没有`rag`的存在，因此**`ragVariables`**也一定是空的
- 以及由于没有数据库节点、各类工具节点（`mcp`、`workflow`），因此如**`buildInTools`、`workflowTools`等也是空的**

上述的几类变量在当前代码中未完全清除（当前清除了部分，造成了一些代码杂乱的情况），他们现阶段是无用的，可能未来也无用，建议后期清除整理相关代码。



##### 3.关于`workflow`多实例状态

当前与`dify`最大的不同之一就是当前的工作流是存在父子工作流关系（同时存在）的，以及支持切换窗口进行编辑。

![multi-workflow](D:\workspace\git\intelligent-backtest\img\multi-workflow.gif)



这里状态主要分为两部分：



- `vueflow`内自己的状态，主要为节点属性、边属性等。

这一部分状态的获取与控制主要通过`useVueFlow`这一方法获取。由于`vueflow`本身是支持多实例的，因此该方法能够通过传递`id`进行区分（在当前项目中，只有单实例，是类似多实例的效果，但为了统一或以后拓展多流程图展现方式，因此也使用`id`进行区分）

```vue
<VueFlow :id="props.id"></VueFlow>
```

```typescript
const store = useVueFlow(instanceId);
const { nodes, setNodes, setEdges } = store;
```

这一部分只要在实例销毁时将`nodes`、`edges`的数据进行保存，并在实例生成时进行重新设置就可以实现切换



- 外部控制的当前流程图交互装备，如控制模式、历史操作记录等

这一部分位于`workflow`组件内`store`内，并较于`dify`，在外层包裹了实例管理。

```typescript
/**
 * 单个流程图实例的完整状态
 */
type WorkflowInstanceState =
  & WorkflowSliceShape
  & NodeSliceShape
  & EnvVariableSliceShape
  & WorkflowHistorySliceShape
  & PanelSliceShape
  & LayoutSliceShape
export const useWorkflowStore = defineStore('workflow-ui', () => {
  // 使用 Map 存储每个实例的状态，key 为 instanceId
  const instances = new Map<string, WorkflowInstanceState>()

  /**
   * 获取或创建实例状态
   */
  const getOrCreateInstance = (instanceId: string): WorkflowInstanceState => {
    if (!instances.has(instanceId)) {
      instances.set(instanceId, {
        ...createNodeSlice(),
        ...createWorkflowSlice(),
        ...createEnvVariableSlice(),
        ...createWorkflowHistorySlice(),
        ...createPanelSlice(),
        ...createLayoutSlice(),
      })
    }
    return instances.get(instanceId)!
  }

  /**
   * 初始化实例
   */
  const initInstance = (instanceId: string) => {
    return getOrCreateInstance(instanceId)
  }

  /**
   * 销毁实例
   */
  const destroyInstance = (instanceId: string) => {
    instances.delete(instanceId)
  }


  return {
    // 实例管理方法
    instances,
    initInstance,
    destroyInstance,
  }
})
```

这样每个`workflow`实例（或者说当前实例）就会只针对当前实例状态进行控制。



**关于流程图/实例`id`**

为便于统一控制，**上述两种状态的`id`，在这里会保持一致**，均是通过外部注入的方式控制。

```vue
<VueFlow :id="props.id"></VueFlow>
```

```typescript
const {
  instanceId,
  instance: workflowStore,
  cleanInstance,
} = useWorkflowInstance(props.id); // 在首次获取实例时，会初始化该id对应的状态实例
```

当前子流程图的`workflow_id`就是对应它在主流程图中的节点`id`，而主流程图的`id`则是一个常量

```typescript
export const MAIN_WORKFLOW_APP_ID = 'main-workflow-app';
```



**`id`注入**

为了方便各类`hook`或者组件获取当前流程图`id`进行控制，我在工作流组件外层包了一层，并注入了`id`

```typescript
// src\components\workflow\index.vue

provide('workflowInstanceId', props.id);
```

```typescript
// src\components\workflow\hooks\use-workflow-instance.ts

/**
 * 流程图实例管理 Hook
 * @param instanceId 实例唯一标识符，通常使用 WorkflowProps.id
 */
export function useWorkflowInstance(instanceId?: string) {
  const store = useWorkflowStore()
  instanceId = instanceId || inject('workflowInstanceId') as string

  // 初始化实例
  const instance = store.initInstance(instanceId)

  if (!instance) {
    throw new Error(`Failed to initialize workflow instance: ${instanceId}`)
  }

  const cleanInstance = () => {
    store.destroyInstance(instanceId)
  }

  // 返回当前实例的状态和操作方法
  return {
    instanceId,
    instance,
    cleanInstance,
  }
}
```

⚠ **实际上`inject`并不是可靠的**，存在一种情况当某个`hook`是在外部调用的，它不在该组件的生命周期内，此时调用`inject`会发出警告，且无法获取到`workflowInstanceId`，这会导致`hook`无法正确执行，这种情况是灾难性的。在该项目中确实存在这种情况，用户可以通过和大模型对话从外部控制`flow`，如节点的新增删除。为了解决这一情况，我几乎在所有有关的`hook`中都增加了`instanceId`这一参数，使得能够在外层直接指定流程图`id`，从而代替通过`inject`的方式获取。不过这一方法使得代码略显的难看了一些，目前还未想到更好的解决方案，后续有时间建议优化这一问题。

> 同样不可靠的还有国际化库方法`useI18n`，外部调用时若产生报错，则需要使用：
>
> ```typescript
> const t = i18n.global.t;
> ```



##### 4.关于AI能力调用

这是本项目与`dify`的另一大不同，也是项目的核心价值，`nl2workflow`。

![ai-workflow](D:\workspace\git\intelligent-backtest\img\ai-workflow.gif)

实际上这一功能的实现是前端将画布能力通过`function call`注入的方式提供给大模型调用。

在本项目中右侧是一个在线业务的`iframe`，通过`postMessage`传递协议。

而对于`function call`能力的定义与实现则位于

```typescript
// src\components\workflow\hooks\use-function-call.ts

// 这一协议的规范是与`open ai`匹配的
const callExternalCapabilitiesTools = [
// get_workflow_info
{
  type: "function",
  function: {
    name: FunctionCallName.GetWorkflowInfo,
    description: "用于获取当前工作流完整的nodes和edges的关系",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  tool_id: "456",
},
] as const satisfies CallExternalCapabilitiesTool[];

/** 查询画布数据具体方法，会过滤算子概览节点数据 */
const callGetWorkflowInfo = () => {
	// 也就是在这里出现了上述组件生命周期之外`inject`无效的情况
    const store = useVueFlow(payload.value.workflowId);
    const { nodes, edges } = store;
    return {
      nodes: unref(nodes).map((node) => ({
        id: node.id,
        data: node.type !== BlockEnum.OperatorOverview ? node.data : null,
        position: node.position,
        parentNode: node.parentNode,
        type: node.type,
        width: node.width,
        height: node.height,
      })),
      edges: unref(edges).map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        type: edge.type,
        data: edge.data,
      })),
    };
};
```

而关于`iframe`的通信则主要实现：

```typescript
const handleCallExternalCapabilities = async (data: { functionCallAction: FunctionCallAction[] }) => {
  for (const action of data.functionCallAction) {
    try {
      const context = {
        aime: aimeRef.value,
        respFunction: (status: boolean, data: any) => {
          aimeRef.value?.respFunctionCall(action.uuid, status, data)
        }
      }
      const result = await functionCallMap[action.function.name as keyof typeof functionCallMap](action.function.arguments as any, context)
      if (!asyncFunctionCalls.includes(action.function.name as keyof typeof functionCallMap)) {
        aimeRef.value?.respFunctionCall(action.uuid, true, {
          data: JSON.stringify(result),
        })
      }
    } catch (error) {
      console.log('aime调用外部能力报错：', error)
      aimeRef.value?.respFunctionCall(action.uuid, false, {
        data: (error as Error).message,
        error: error as Error
      })
    }
  }
}
```

⚠**虽然这里已经实现了异步方法调用的处理，但还有一个必须要解决的部分——用户交互**。以现在的实现无法做到触发某个方法调用后，等待用户完成交互再返回大模型进行后续操作的能力，如大模型调用工作流运行的能力，用户为工作流运行设置输入值，完成运行并返回结果这一过程。为解决这一问题，**需要在全局完成一套`function call`回调的注册、执行机制**。



------



### 三、其余的一些问题

##### 1.关于只读

虽然照搬了`dify`的`useNodesReadOnly`，但实际上目前只读的场景只有在工作流运行时（事实上现在这里当前也不会设置工作流为运行状态）且部分`element-plus`组件没有很完善的设置`disabled`属性（存在遗漏）。此外在大模型操作画布时，需要设置全局只读（**一定不能切换画布**，因为需要与大模型上下文对齐），当前这里并无控制。



##### 2.关于节点及其可连接关系

主要位于以下几个文件：

```bash
src\components\workflow\hooks\use-nodes-meta-data.ts
src\components\workflow\hooks\use-available-nodes-meta-data.ts
src\components\workflow\hooks\use-available-blocks.ts
```

他们定义了哪些节点可以可以出现的，哪些节点之后可以添加哪些节点等。



##### 3.`redo/undo`历史记录

当前自行实现了一套历史状态（状态定义和`UI`移植了`dify`）保存的机制，目前并未经过很完善的测试，似乎在某些场景下存在`Bug`，且没记录`ai`控制工作流的操作，后期需要添加这一部分，难点在于如何区分`ai`控制/用户操作。



##### 4.关于国际化

目前国际化已经实现，但存在部分文件以及定义是冗余的，需要删除。此外由于`react-i18n`和`vue-i18n`的语法差异，需要对部分插值语法进行调整，如`{{}}`替换为`{}`，以及单复数的插值模板修正



##### 5.关于算子流（子工作流）

算子流是独立工作计算的，后端调用不太一致，对应更新画布的`function call`也不一致。算子流只能使用内部变量，不过当前赋予了算子流输入输出的能力，体现在主流程图中的**算子概览**节点，算子流的图数据也保存在算子概览节点之中。当算子流展开式会从算子概览节点获取图数据，并加载到`vueflow`中，当切换流程图时，会将当前的流程图数据同步至主流程图中，具体参考：`src\components\workflow-app\store\index.ts`

> 由于父子流程图的复杂交互，当前没有实现变量名修改之类的操作直接修改主流程图或算子流内部的变量引用（`dify`对于`if-else`节点也未实现）



------



### 四、后续工作与总结

1. 需要拓展外层即整体布局`UI`优化
2. 需要完善只读控制
3. 需要完善`AI`能力调用的回调注册与执行机制，实现用户交互的异步能力
4. 需要优化国际化配置（现状使用的不会有问题，需要删除冗余的以及调整不适配的插值语法）
5. 需要优化`redo/undo`
6. 需要设计主题色，替换组件库与图标库更新`UI`，实现差异化
7. 需要实现单节点调试功能（环境变量、节点追溯等功能）
8. 后期需要拓展工具节点，这一部分需要参考`dify`，并清理或修正当前的冗余代码
9. 清理当前冗余的移植代码`tsx`等



------



### 五、关于部署

后期需要部署到国内与国外两个环境。

当前已完成国内部署（`cbas`集群，原因是后端服务部署在当前集群），不过当前嵌入`ai`的`iframe`为海外业务，后期需要替换为国内业务。域名使用的为`quant`域名，该部分通过工单打通了跨集群网络实现域名分发。
