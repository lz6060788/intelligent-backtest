export default {
  title: 'Intelligent Backtest',
  model: {
    params: {
      temperature: 'Temperature',
      temperatureTip:
        'Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.',
      top_p: 'Top P',
      top_pTip:
        'Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered.',
      presence_penalty: 'Presence penalty',
      presence_penaltyTip:
        'How much to penalize new tokens based on whether they appear in the text so far.\nIncreases the model\'s likelihood to talk about new topics.',
      frequency_penalty: 'Frequency penalty',
      frequency_penaltyTip:
        'How much to penalize new tokens based on their existing frequency in the text so far.\nDecreases the model\'s likelihood to repeat the same line verbatim.',
      max_tokens: 'Max token',
      max_tokensTip:
        'Used to limit the maximum length of the reply, in tokens. \nLarger values may limit the space left for prompt words, chat logs, and Knowledge. \nIt is recommended to set it below two-thirds\ngpt-4-1106-preview, gpt-4-vision-preview max token (input 128k output 4k)',
      maxTokenSettingTip: 'Your max token setting is high, potentially limiting space for prompts, queries, and data. Consider setting it below 2/3.',
      setToCurrentModelMaxTokenTip: 'Max token is updated to the 80% maximum token of the current model {{maxToken}}.',
      stop_sequences: 'Stop sequences',
      stop_sequencesTip: 'Up to four sequences where the API will stop generating further tokens. The returned text will not contain the stop sequence.',
      stop_sequencesPlaceholder: 'Enter sequence and press Tab',
    },
    tone: {
      Creative: 'Creative',
      Balanced: 'Balanced',
      Precise: 'Precise',
      Custom: 'Custom',
    },
    addMoreModel: 'Go to settings to add more models',
    settingsLink: 'Model Provider Settings',
    capabilities: 'MultiModal Capabilities',
  },
}
