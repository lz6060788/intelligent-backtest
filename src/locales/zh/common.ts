export default {
  title: '智能回测',
  model: {
    params: {
      temperature: '隨機性 temperature',
      temperatureTip:
        '控制回覆的隨機性。\n值越大，回覆越隨機。\n值越小，回覆越確定或一致。',
      top_p: '核取樣 top_p',
      top_pTip:
        '控制生成多樣性。\n值越大，輸出會包括更多的單詞選項。\n值越小，模型會更集中在高機率的單詞上，輸出更確定但可能缺乏多樣性。\n核取樣和隨機性不建議同時修改。',
      presence_penalty: '話題新鮮度 presence_penalty',
      presence_penaltyTip:
        '控制生成時對上文已存在的話題的偏好程度。\n值越大，越可能使用到新的話題。',
      frequency_penalty: '頻率懲罰度 frequency_penalty',
      frequency_penaltyTip:
        '影響常見與罕見詞彙使用。\n值較大時，傾向於生成不常見的詞彙和表達方式。\n值越小，更傾向於使用常見和普遍接受的詞彙或短語。',
      max_tokens: '單次回覆限制 max_tokens',
      max_tokensTip:
        '用於限制回覆的最大長度，以 token 為單位。\n較大的值可能會限制給提示詞、聊天記錄和知識庫留出的空間。\n建議將其設定在三分之二以下。\ngpt-4-1106-preview、gpt-4-vision-preview 最大長度 (輸入 128k，輸出 4k)',
      maxTokenSettingTip: '您設定的最大 tokens 數較大，可能會導致 prompt、使用者問題、知識庫內容沒有 token 空間進行處理，建議設定到 2/3 以下。',
      setToCurrentModelMaxTokenTip: '最大令牌數更新為當前模型最大的令牌數 {{maxToken}} 的 80%。',
      stop_sequences: '停止序列 stop_sequences',
      stop_sequencesTip: '最多四個序列，API 將停止生成更多的 token。返回的文字將不包含停止序列。',
      stop_sequencesPlaceholder: '輸入序列並按 Tab 鍵',
    },
    tone: {
      Creative: '創意',
      Balanced: '平衡',
      Precise: '精確',
      Custom: '自定義',
    },
    addMoreModel: '新增更多模型',
    settingsLink: 'Model Provider 設置',
    capabilities: '多模式功能',
  },
}
