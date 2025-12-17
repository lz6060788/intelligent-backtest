import type { NodeDefault } from "@/types";
import { CodeLanguage, type CodeNodeType } from "./types";
import { genNodeMetaData } from "@/components/workflow/utils";
import { BlockEnum, VarType } from "@/types";
import { BlockClassificationEnum } from "@/types";

const i18nPrefix = "workflow.errorMsg";

const metaData = genNodeMetaData({
  classification: BlockClassificationEnum.Transform,
  sort: 1,
  type: BlockEnum.Code,
});
const nodeDefault: NodeDefault<CodeNodeType> = {
  metaData,
  defaultValue: {
    code: '\ndef main(arg1: str, arg2: str):\n    return {\n        \"result\": arg1 + arg2,\n    }\n',
    code_language: CodeLanguage.python3,
    variables: [],
    outputs: {
      result: {
        type: VarType.string,
        children: null,
      },
    },
  },
  checkValid(payload: CodeNodeType, t: any) {
    let errorMessages = "";
    const { code, variables } = payload;
    if (!errorMessages && variables.filter((v) => !v.variable).length > 0)
      errorMessages = t(`${i18nPrefix}.fieldRequired`, {
        field: t(`${i18nPrefix}.fields.variable`),
      });
    if (
      !errorMessages &&
      variables.filter((v) => !v.value_selector.length).length > 0
    )
      errorMessages = t(`${i18nPrefix}.fieldRequired`, {
        field: t(`${i18nPrefix}.fields.variableValue`),
      });
    if (!errorMessages && !code)
      errorMessages = t(`${i18nPrefix}.fieldRequired`, {
        field: t(`${i18nPrefix}.fields.code`),
      });

    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    };
  },
};

export default nodeDefault;
