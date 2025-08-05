"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  BarChart3,
  Target,
  Clock,
  Users,
  Zap
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface AIInsight {
  id: string;
  type: 'warning' | 'suggestion' | 'achievement' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
}

interface TaskSuggestion {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedHours: number;
  confidence: number;
}

interface RiskPrediction {
  risk: string;
  probability: number;
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
  timeline: string;
}

export const AIDashboard = () => {
  const params = useParams();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [taskSuggestions, setTaskSuggestions] = useState<TaskSuggestion[]>([]);
  const [riskPredictions, setRiskPredictions] = useState<RiskPrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [projectHealth, setProjectHealth] = useState(85);

  // Mock data for demonstration - in real app, this would come from AI service
  useEffect(() => {
    loadAIInsights();
  }, []);

  const loadAIInsights = async () => {
    setIsLoading(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      setInsights([
        {
          id: '1',
          type: 'warning',
          title: 'Potential Deadline Risk',
          description: 'Based on current velocity, there\'s a 73% chance of missing the sprint deadline. Consider reallocating resources.',
          confidence: 73,
          actionable: true,
          priority: 'high',
          timestamp: new Date()
        },
        {
          id: '2',
          type: 'suggestion',
          title: 'Optimize Task Dependencies',
          description: 'AI detected 3 tasks that could be parallelized to reduce timeline by 2-3 days.',
          confidence: 89,
          actionable: true,
          priority: 'medium',
          timestamp: new Date()
        },
        {
          id: '3',
          type: 'achievement',
          title: 'Team Velocity Improved',
          description: 'Team velocity increased by 23% this week compared to historical average.',
          confidence: 95,
          actionable: false,
          priority: 'low',
          timestamp: new Date()
        }
      ]);

      setTaskSuggestions([
        {
          title: 'Set up automated testing pipeline',
          description: 'Based on project type and current architecture, implementing automated tests will reduce bugs by ~40%.',
          priority: 'high',
          estimatedHours: 8,
          confidence: 87
        },
        {
          title: 'Create user onboarding flow',
          description: 'Analysis shows projects with early onboarding have 60% better user adoption rates.',
          priority: 'medium',
          estimatedHours: 12,
          confidence: 78
        }
      ]);

      setRiskPredictions([
        {
          risk: 'Resource Overallocation',
          probability: 68,
          impact: 'medium',
          mitigation: 'Redistribute 2-3 tasks from John to Sarah who has lighter workload',
          timeline: 'Next 5 days'
        },
        {
          risk: 'Scope Creep',
          probability: 45,
          impact: 'high',
          mitigation: 'Lock feature requirements and set up change request process',
          timeline: 'Mid-sprint'
        }
      ]);

      setIsLoading(false);
    }, 1500);
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'suggestion':
        return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'achievement':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'prediction':
        return <TrendingUp className="h-4 w-4 text-purple-500" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Project Assistant</h1>
            <p className="text-gray-600">Intelligent insights and recommendations</p>
          </div>
        </div>
        <Button 
          onClick={loadAIInsights} 
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Refresh Analysis
            </div>
          )}
        </Button>
      </div>

      {/* Project Health Score */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-600" />
            Project Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Progress value={projectHealth} className="h-3" />
            </div>
            <div className="text-2xl font-bold text-green-600">{projectHealth}%</div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Based on velocity, risk factors, team performance, and timeline adherence
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Smart Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="p-4 rounded-lg border bg-white/50">
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                      <Badge className={getPriorityColor(insight.priority)}>
                        {insight.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Confidence: {insight.confidence}%</span>
                      {insight.actionable && (
                        <Badge variant="outline" className="text-xs">
                          Actionable
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Task Suggestions */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              AI Task Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {taskSuggestions.map((suggestion, index) => (
              <div key={index} className="p-4 rounded-lg border bg-white/50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{suggestion.title}</h4>
                  <Badge className={getPriorityColor(suggestion.priority)}>
                    {suggestion.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {suggestion.estimatedHours}h
                    </span>
                    <span>AI Confidence: {suggestion.confidence}%</span>
                  </div>
                  <Button size="sm" variant="outline">
                    Add Task
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Risk Predictions */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Risk Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {riskPredictions.map((risk, index) => (
              <div key={index} className="p-4 rounded-lg border bg-white/50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{risk.risk}</h4>
                  <Badge className={getPriorityColor(risk.impact)}>
                    {risk.impact} impact
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Probability:</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${risk.probability}%` }}
                      />
                    </div>
                    <span className="font-medium">{risk.probability}%</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Timeline:</span>
                    <span className="ml-2 font-medium">{risk.timeline}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Mitigation:</span>
                    <p className="text-gray-800 mt-1">{risk.mitigation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>AI-Powered Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <TrendingUp className="h-6 w-6 text-blue-500" />
              <span className="text-sm">Generate Report</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Users className="h-6 w-6 text-green-500" />
              <span className="text-sm">Optimize Resources</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Target className="h-6 w-6 text-purple-500" />
              <span className="text-sm">Prioritize Tasks</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
              <span className="text-sm">Risk Analysis</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};