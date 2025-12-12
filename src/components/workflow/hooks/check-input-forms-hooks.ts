import { useI18n } from 'vue-i18n'
import { InputVarType, TransferMethod } from '@/types'
import { ElNotification } from 'element-plus'
import { type InputForm } from '@/types'

export const useCheckInputsForms = () => {
  const { t } = useI18n()

  const checkInputsForm = (inputs: Record<string, any>, inputsForm: InputForm[]) => {
    let hasEmptyInput = ''
    let fileIsUploading = false
    const requiredVars = inputsForm.filter(({ required, type }) => required && type !== InputVarType.checkbox) // boolean can be not checked

    if (requiredVars?.length) {
      requiredVars.forEach(({ variable, label, type }) => {
        if (hasEmptyInput)
          return

        if (fileIsUploading)
          return

        if (!inputs[variable])
          hasEmptyInput = label as string

        if ((type === InputVarType.singleFile || type === InputVarType.multiFiles) && inputs[variable]) {
          const files = inputs[variable]
          if (Array.isArray(files))
            fileIsUploading = files.find(item => item.transferMethod === TransferMethod.local_file && !item.uploadedId)
          else
            fileIsUploading = files.transferMethod === TransferMethod.local_file && !files.uploadedId
        }
      })
    }

    if (hasEmptyInput) {
      ElNotification({ type: 'error', message: t('appDebug.errorMessage.valueOfVarRequired') })
      return false
    }

    if (fileIsUploading) {
      ElNotification({ type: 'info', message: t('appDebug.errorMessage.waitForFileUpload') })
      return
    }

    return true
  }

  return {
    checkInputsForm,
  }
}
