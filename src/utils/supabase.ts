import { createClient } from '@supabase/supabase-js';
import { env } from '../env';

// Create Supabase client
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

// Create admin client for server-side operations
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

// Database utility functions
export const db = {
  // Log interaction history
  async logInteraction(data: {
    userId: string;
    model: string;
    prompt: string;
    result: string;
    metadata?: any;
  }) {
    const { error } = await supabaseAdmin
      .from('interaction_history')
      .insert({
        user_id: data.userId,
        model: data.model,
        prompt: data.prompt,
        result: data.result,
        metadata: data.metadata,
        timestamp: new Date().toISOString(),
      });

    if (error) {
      console.error('Failed to log interaction:', error);
      throw new Error('Failed to log interaction');
    }

    return { success: true };
  },

  // Get user interaction history
  async getUserHistory(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from('interaction_history')
      .select('*')
      .eq('user_id', userId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Failed to fetch user history:', error);
      throw new Error('Failed to fetch user history');
    }

    return data;
  },

  // Get analytics data
  async getAnalytics(userId: string) {
    const { data, error } = await supabase
      .from('interaction_history')
      .select('model, metadata, timestamp')
      .eq('user_id', userId);

    if (error) {
      console.error('Failed to fetch analytics:', error);
      throw new Error('Failed to fetch analytics');
    }

    // Process analytics data
    const modelUsage = data.reduce((acc, interaction) => {
      acc[interaction.model] = (acc[interaction.model] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const intentDistribution = data.reduce((acc, interaction) => {
      const intent = interaction.metadata?.intentCategory || 'unknown';
      acc[intent] = (acc[intent] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalInteractions: data.length,
      modelUsage,
      intentDistribution,
      lastInteraction: data[0]?.timestamp,
    };
  },
};