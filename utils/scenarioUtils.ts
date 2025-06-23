// Utility functions for scenario generation management

export const clearScenarioGeneration = (voiceId: string) => {
  const scenarioKey = `scenario_generated_${voiceId}`;
  localStorage.removeItem(scenarioKey);
  console.log(`🧹 Cleared scenario generation flag: ${scenarioKey}`);
};

export const clearAllScenarioGeneration = () => {
  const keys = Object.keys(localStorage);
  const scenarioKeys = keys.filter(key => key.startsWith('scenario_generated_'));
  
  scenarioKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🧹 Cleared: ${key}`);
  });
  
  console.log(`🧹 Cleared ${scenarioKeys.length} scenario generation flags`);
};

export const checkScenarioGeneration = (voiceId: string) => {
  const scenarioKey = `scenario_generated_${voiceId}`;
  const generated = localStorage.getItem(scenarioKey);
  console.log(`🔍 Scenario generation status for ${voiceId}: ${generated ? 'GENERATED' : 'NOT GENERATED'}`);
  return !!generated;
};

// Helper function you can call from browser console
(window as any).scenarioUtils = {
  clear: clearScenarioGeneration,
  clearAll: clearAllScenarioGeneration,
  check: checkScenarioGeneration
};