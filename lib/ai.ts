import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface TaskSuggestion {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedHours: number;
  suggestedAssignee?: string;
}

export interface RiskPrediction {
  risk: string;
  probability: number;
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  timeline: string;
}

export interface ProjectInsight {
  type: 'warning' | 'suggestion' | 'achievement';
  title: string;
  description: string;
  actionable: boolean;
  priority: number;
}

export class AIProjectManager {
  /**
   * Generate smart task suggestions based on project context
   */
  async generateTaskSuggestions(
    projectTitle: string,
    projectDescription: string,
    existingTasks: string[],
    projectType: string = 'general'
  ): Promise<TaskSuggestion[]> {
    try {
      const prompt = `
        As an AI Project Management Assistant, analyze this project and suggest 3-5 relevant tasks:
        
        Project: ${projectTitle}
        Description: ${projectDescription}
        Type: ${projectType}
        Existing Tasks: ${existingTasks.join(', ')}
        
        Generate task suggestions that:
        1. Don't duplicate existing tasks
        2. Are specific and actionable
        3. Follow logical project progression
        4. Include realistic time estimates
        
        Return as JSON array with format:
        {
          "title": "Task name",
          "description": "Detailed description",
          "priority": "low|medium|high",
          "estimatedHours": number
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating task suggestions:', error);
      return [];
    }
  }

  /**
   * Predict project risks using AI analysis
   */
  async predictProjectRisks(
    projectData: {
      title: string;
      description: string;
      timeline: string;
      teamSize: number;
      budget?: number;
      complexity: 'low' | 'medium' | 'high';
    }
  ): Promise<RiskPrediction[]> {
    try {
      const prompt = `
        Analyze this project for potential risks:
        
        Title: ${projectData.title}
        Description: ${projectData.description}
        Timeline: ${projectData.timeline}
        Team Size: ${projectData.teamSize}
        Complexity: ${projectData.complexity}
        ${projectData.budget ? `Budget: $${projectData.budget}` : ''}
        
        Identify 3-5 most likely risks with:
        1. Risk description
        2. Probability (0-100%)
        3. Impact level
        4. Mitigation strategy
        5. When it might occur
        
        Return as JSON array.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1200,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Error predicting risks:', error);
      return [];
    }
  }

  /**
   * Generate intelligent project insights
   */
  async generateProjectInsights(
    projectMetrics: {
      completedTasks: number;
      totalTasks: number;
      overdueTasks: number;
      teamVelocity: number;
      daysRemaining: number;
      budgetUsed: number;
      budgetTotal: number;
    }
  ): Promise<ProjectInsight[]> {
    try {
      const prompt = `
        Analyze these project metrics and provide actionable insights:
        
        Completed Tasks: ${projectMetrics.completedTasks}/${projectMetrics.totalTasks}
        Overdue Tasks: ${projectMetrics.overdueTasks}
        Team Velocity: ${projectMetrics.teamVelocity} tasks/week
        Days Remaining: ${projectMetrics.daysRemaining}
        Budget Used: $${projectMetrics.budgetUsed}/$${projectMetrics.budgetTotal}
        
        Provide insights about:
        1. Progress status and trajectory
        2. Resource allocation
        3. Timeline feasibility
        4. Budget management
        5. Team performance
        
        Focus on actionable recommendations.
        Return as JSON array with type, title, description, actionable, priority fields.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Error generating insights:', error);
      return [];
    }
  }

  /**
   * Optimize task priorities using AI
   */
  async optimizeTaskPriorities(
    tasks: Array<{
      id: string;
      title: string;
      description?: string;
      currentPriority: string;
      dependencies: string[];
      estimatedHours: number;
      dueDate?: string;
    }>,
    projectGoals: string[]
  ): Promise<Array<{ taskId: string; recommendedPriority: string; reasoning: string }>> {
    try {
      const prompt = `
        Analyze these tasks and optimize their priorities based on project goals:
        
        Project Goals: ${projectGoals.join(', ')}
        
        Tasks: ${JSON.stringify(tasks, null, 2)}
        
        Consider:
        1. Impact on project goals
        2. Dependencies between tasks
        3. Due dates and timeline
        4. Resource requirements
        5. Risk factors
        
        Return optimized priorities with reasoning for each change.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('No response from AI');

      return JSON.parse(content);
    } catch (error) {
      console.error('Error optimizing priorities:', error);
      return [];
    }
  }

  /**
   * Generate automated status reports
   */
  async generateStatusReport(
    projectData: {
      name: string;
      progress: number;
      completedTasks: number;
      totalTasks: number;
      risks: string[];
      achievements: string[];
      nextMilestones: string[];
      teamMembers: number;
    }
  ): Promise<string> {
    try {
      const prompt = `
        Generate a professional project status report:
        
        Project: ${projectData.name}
        Progress: ${projectData.progress}%
        Tasks: ${projectData.completedTasks}/${projectData.totalTasks}
        Team Size: ${projectData.teamMembers}
        
        Recent Achievements:
        ${projectData.achievements.map(a => `- ${a}`).join('\n')}
        
        Current Risks:
        ${projectData.risks.map(r => `- ${r}`).join('\n')}
        
        Upcoming Milestones:
        ${projectData.nextMilestones.map(m => `- ${m}`).join('\n')}
        
        Create a concise, executive-friendly status report with:
        1. Executive Summary
        2. Progress Highlights
        3. Key Achievements
        4. Risk Assessment
        5. Next Steps
        
        Use professional tone and clear structure.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 1200,
      });

      return response.choices[0]?.message?.content || 'Unable to generate report';
    } catch (error) {
      console.error('Error generating status report:', error);
      return 'Error generating automated report. Please try again.';
    }
  }
}

export const aiProjectManager = new AIProjectManager();