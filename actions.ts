
'use server';

import { generatePersonalizedSchedule, PersonalizedScheduleGenerationInput } from '@/ai/flows/personalized-schedule-generation';
import { suggestScheduleOptimizations, SuggestScheduleOptimizationsInput } from '@/ai/flows/schedule-optimization-suggestions';


export async function optimizeSchedule(data: SuggestScheduleOptimizationsInput) {
  try {
    const result = await suggestScheduleOptimizations(data);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error optimizing schedule:', error);
    return { success: false, error: 'Failed to optimize schedule.' };
  }
}

export async function generateSchedule(data: PersonalizedScheduleGenerationInput) {
  try {
    const result = await generatePersonalizedSchedule(data);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('[generateSchedule Action Error]', error);
    return { success: false, error: error.message || 'Failed to generate schedule via AI.' };
  }
}
