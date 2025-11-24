import useVarList from '../_base/hooks/use-var-list'
import type { Var } from '@/types'
import { VarType } from '@/types'
import type { Authorization, Body, BodyType, HttpNodeType, Method, Timeout } from './types'
import useKeyValueList from './hooks/use-key-value-list'
import { transformToBodyPayload } from './utils'
import { useNodesReadOnly } from '@/components/workflow/hooks'
import useNodeCrud from '@/components/workflow/nodes/_base/hooks/use-node-crud'
import { ref, type Ref } from 'vue'

const useConfig = (id: string, inputs: Ref<HttpNodeType>) => {
  const { nodesReadOnly: readOnly } = useNodesReadOnly()

  // const defaultConfig = useStore(s => s.nodesDefaultConfigs?.[payload.type])
  // const defaultConfig = 

  const { setInputs } = useNodeCrud<HttpNodeType>(id)

  const { handleVarListChange, handleAddVariable } = useVarList<HttpNodeType>({
    inputs,
    setInputs,
  })

  const isDataReady = ref(true);

  // useEffect(() => {
  //   const isReady = defaultConfig && Object.keys(defaultConfig).length > 0
  //   if (isReady) {
  //     const newInputs = {
  //       ...defaultConfig,
  //       ...inputs,
  //     }
  //     const bodyData = newInputs.body.data
  //     if (typeof bodyData === 'string') {
  //       newInputs.body = {
  //         ...newInputs.body,
  //         data: transformToBodyPayload(bodyData, [BodyType.formData, BodyType.xWwwFormUrlencoded].includes(newInputs.body.type)),
  //       }
  //     }
  //     else if (!bodyData) {
  //       newInputs.body = {
  //         ...newInputs.body,
  //         data: [],
  //       }
  //     }

  //     setInputs(newInputs)
  //     setIsDataReady(true)
  //   }
  // }, [defaultConfig])

  const handleMethodChange = (method: Method) => {
    const newInputs = {
      ...inputs.value,
      method,
    }
    setInputs(newInputs)
  }

  const handleUrlChange = (url: string) => {
    const newInputs = {
      ...inputs.value,
      url,
    }
    setInputs(newInputs)
  }

  const handleFieldChange = (field: string) => {
    return (value: string) => {
      console.log('handleFieldChange', field, value)
      const newInputs = {
        ...inputs.value,
        [field]: value,
      }
      setInputs(newInputs)
    }
  }

  const {
    list: headers,
    setList: setHeaders,
    addItem: addHeader,
    isKeyValueEdit: isHeaderKeyValueEdit,
    toggleIsKeyValueEdit: toggleIsHeaderKeyValueEdit,
  } = useKeyValueList(inputs.value.headers, handleFieldChange('headers'))

  const {
    list: params,
    setList: setParams,
    addItem: addParam,
    isKeyValueEdit: isParamKeyValueEdit,
    toggleIsKeyValueEdit: toggleIsParamKeyValueEdit,
  } = useKeyValueList(inputs.value.params, handleFieldChange('params'))

  const setBody = (data: Body) => {
    const newInputs = {
      ...inputs.value,
      body: data,
    }
    setInputs(newInputs)
  }

  // authorization
  // const [isShowAuthorization, {
  //   setTrue: showAuthorization,
  //   setFalse: hideAuthorization,
  // }] = useBoolean(false)

  // const setAuthorization = (authorization: Authorization) => {
  //   const newInputs = {
  //     ...inputs.value,
  //     authorization,
  //   }
  //   setInputs(newInputs)
  // }

  const setTimeout = (timeout: Timeout) => {
    const newInputs = {
      ...inputs.value,
      timeout,
    }
    setInputs(newInputs)
  }

  const filterVar = (varPayload: Var) => {
    return [VarType.string, VarType.number, VarType.secret].includes(varPayload.type)
  }

  // curl import panel
  // const [isShowCurlPanel, {
  //   setTrue: showCurlPanel,
  //   setFalse: hideCurlPanel,
  // }] = useBoolean(false)


  // const handleSSLVerifyChange = useCallback((checked: boolean) => {
  //   const newInputs = produce(inputs, (draft: HttpNodeType) => {
  //     draft.ssl_verify = checked
  //   })
  //   setInputs(newInputs)
  // }, [inputs, setInputs])

  return {
    readOnly,
    isDataReady,
    inputs,
    handleVarListChange,
    handleAddVariable,
    filterVar,
    handleMethodChange,
    handleUrlChange,
    // headers
    headers,
    setHeaders,
    addHeader,
    isHeaderKeyValueEdit,
    toggleIsHeaderKeyValueEdit,
    // params
    params,
    setParams,
    addParam,
    isParamKeyValueEdit,
    toggleIsParamKeyValueEdit,
    // body
    setBody,
    // ssl verify
    // handleSSLVerifyChange,
    // authorization
    // isShowAuthorization,
    // showAuthorization,
    // hideAuthorization,
    // setAuthorization,
    setTimeout,
    // curl import
    // isShowCurlPanel,
    // showCurlPanel,
    // hideCurlPanel,
    // handleCurlImport,
  }
}

export default useConfig
