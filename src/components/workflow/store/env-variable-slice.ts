import type { EnvironmentVariable } from '@/types'
import { ref, type Ref } from 'vue'

export type EnvVariableSliceShape = {
  showEnvPanel: Ref<boolean>
  setShowEnvPanel: (val: boolean) => void
  environmentVariables: Ref<EnvironmentVariable[]>
  setEnvironmentVariables: (val: EnvironmentVariable[]) => void
  envSecrets: Ref<Record<string, string>>
  setEnvSecrets: (val: Record<string, string>) => void
}

export const createEnvVariableSlice = (): EnvVariableSliceShape => {
  const showEnvPanel = ref(false)
  const setShowEnvPanel = (val: boolean) => { showEnvPanel.value = val }
  const environmentVariables = ref<EnvironmentVariable[]>([])
  const setEnvironmentVariables = (val: EnvironmentVariable[]) => { environmentVariables.value = val }
  const envSecrets = ref<Record<string, string>>({})
  const setEnvSecrets = (val: Record<string, string>) => { envSecrets.value = val }

  return {
    showEnvPanel,
    setShowEnvPanel,
    environmentVariables,
    setEnvironmentVariables,
    envSecrets,
    setEnvSecrets,
  }
}
