import { ref, computed, onMounted, watch, type Ref } from 'vue';
import { PYTHON_CONFIG_DEFAULT, JAVASCRIPT_CONFIG_DEFAULT } from './constant';
import { BlockEnum, VarType } from '@/types';
import type { Var, Variable } from '@/types';
import type { CodeNodeType, OutputVar } from './types';
import { CodeLanguage } from './types';
import { useNodeCrud, useVarList, useOutputVarList } from '@/components/workflow/nodes/_base/hooks';
import { useNodesReadOnly } from '@/components/workflow/hooks';
import { cloneDeep } from 'lodash-es';

const useConfig = (id: string, inputs: Ref<CodeNodeType>) => {
  const { nodesReadOnly: readOnly } = useNodesReadOnly();

  const allLanguageDefault = ref<Record<CodeLanguage, Partial<CodeNodeType>> | null>({
    [CodeLanguage.javascript]: cloneDeep(JAVASCRIPT_CONFIG_DEFAULT.config),
    [CodeLanguage.python3]: PYTHON_CONFIG_DEFAULT.config,
    [CodeLanguage.json]: {
      "variables": [],
      "code_language": "json",
      "code": "{\n}\n",
      "outputs": {
        "result": {
          "type": "string",
          "children": null
        }
      }
    } as Partial<CodeNodeType>
  });


  // const defaultConfig = computed(() => store.state.nodesDefaultConfigs?.[payload.type]);
  const { setInputs } = useNodeCrud<CodeNodeType>(id);
  const { handleVarListChange, handleAddVariable } = useVarList<CodeNodeType>({
    inputs,
    setInputs,
  });

  const outputKeyOrders = ref<string[]>([]);
  const syncOutputKeyOrders = (outputs: OutputVar) => {
    outputKeyOrders.value = Object.keys(outputs);
  };



  onMounted(() => {
    if (inputs.value.outputs && Object.keys(inputs.value.outputs).length > 0) {
      syncOutputKeyOrders(inputs.value.outputs);
    }
  })

  const handleCodeChange = (code: string) => {
    setInputs({
     ...inputs.value,
      code,
    });
  };

  const handleCodeLanguageChange = (codeLanguage: CodeLanguage) => {
    const currDefaultConfig = allLanguageDefault.value?.[codeLanguage];
    let newInputs = { ...inputs.value };
    newInputs.code_language = codeLanguage;
    if (currDefaultConfig) {
      newInputs.code = currDefaultConfig.code || '';
      newInputs.variables = currDefaultConfig.variables || [];
      newInputs.outputs = currDefaultConfig.outputs || {};
    }
    setInputs(newInputs);
  };

  const handleSyncFunctionSignature = () => {
    const generateSyncSignatureCode = (code: string) => {
      let mainDefRe: RegExp;
      let newMainDef: string;
      if (inputs.value.code_language === CodeLanguage.javascript) {
        mainDefRe = /function\s+main\b\s*\([\s\S]*?\)/g;
        newMainDef = 'function main({{var_list}})';
        let param_list = inputs.value.variables?.map(item => item.variable).join(', ') || '';
        param_list = param_list? `{${param_list}}` : '';
        newMainDef = newMainDef.replace('{{var_list}}', param_list);
      } else if (inputs.value.code_language === CodeLanguage.python3) {
        mainDefRe = /def\s+main\b\s*\([\s\S]*?\)/g;
        const param_list: string[] = [];
        for (const item of inputs.value.variables) {
          let param = item.variable;
          let param_type = '';
          switch (item.value_type) {
            case VarType.string:
              param_type = ': str';
              break;
            case VarType.number:
              param_type = ': float';
              break;
            case VarType.object:
              param_type = ': dict';
              break;
            case VarType.array:
              param_type = ': list';
              break;
            case VarType.arrayNumber:
              param_type = ': list[float]';
              break;
            case VarType.arrayString:
              param_type = ': list[str]';
              break;
            case VarType.arrayObject:
              param_type = ': list[dict]';
              break;
          }
          param += param_type;
          param_list.push(`${param}`);
        }
        newMainDef = `def main(${param_list.join(', ')})`;
      } else {
        return code;
      }
      const newCode = code.replace(mainDefRe, newMainDef);
      return newCode;
    };

    setInputs({
     ...inputs.value,
      code: generateSyncSignatureCode(inputs.value.code),
    });
  };

  const {
    handleVarsChange,
    handleAddVariable: handleAddOutputVariable,
    handleRemoveVariable,
    isShowRemoveVarConfirm,
    hideRemoveVarConfirm,
    onRemoveVarConfirm,
  } = useOutputVarList<CodeNodeType>({
    id,
    inputs,
    setInputs,
    outputKeyOrders,
    onOutputKeyOrdersChange: (newOrders) => outputKeyOrders.value = newOrders,
  });

  const filterVar = (varPayload: Var) => {
    return [VarType.string, VarType.number, VarType.boolean, VarType.secret, VarType.object, VarType.array, VarType.arrayNumber, VarType.arrayString, VarType.arrayObject, VarType.arrayBoolean, VarType.file, VarType.arrayFile].includes(varPayload.type);
  };

  const handleCodeAndVarsChange = (code: string, inputVariables: Variable[], outputVariables: OutputVar) => {
    setInputs({
     ...inputs.value,
      code,
      variables: inputVariables,
      outputs: outputVariables,
    });
    syncOutputKeyOrders(outputVariables);
  };

  return {
    readOnly,
    inputs,
    outputKeyOrders,
    handleVarListChange,
    handleAddVariable,
    handleRemoveVariable,
    handleSyncFunctionSignature,
    handleCodeChange,
    handleCodeLanguageChange,
    handleVarsChange,
    filterVar,
    handleAddOutputVariable,
    isShowRemoveVarConfirm,
    hideRemoveVarConfirm,
    onRemoveVarConfirm,
    handleCodeAndVarsChange,
  };
};

export default useConfig;