import baseConfig from '@repo/eslint'

// Create a modified config without problematic rules
const config = baseConfig.map((configItem: any) => {
  if (configItem.rules && configItem.rules['boundaries/element-types']) {
    // Remove boundaries rules
    const { 'boundaries/element-types': _, ...otherRules } = configItem.rules
    return { ...configItem, rules: otherRules }
  }
  return configItem
})

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    files: ['src/**/*.{ts,tsx}'],
  },
  ...config,
]
