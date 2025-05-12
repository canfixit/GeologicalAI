import { useEffect, useState } from 'react';
import { useTerrainStore } from '@/lib/stores/useTerrainStore';
import { AIInsight, InsightType } from '@/types/terrain';
import { Brain, AlertCircle, Search, TrendingUp, Layers, Compass, Zap } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { toast } from 'sonner';

export default function AIInsightsPanel() {
  const { insights, terrainData, isLoadingInsights, setInsights, setLoadingInsights } = useTerrainStore();
  const [activeTab, setActiveTab] = useState<'all' | InsightType>('all');
  const [showLoading, setShowLoading] = useState(false);
  
  // Filter insights based on active tab
  const filteredInsights = activeTab === 'all' 
    ? insights 
    : insights.filter(insight => insight.type === activeTab);
  
  // Get count of insights by type for badge numbers
  const insightCounts = insights.reduce((acc, insight) => {
    acc[insight.type] = (acc[insight.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Function to request new insights analysis
  const requestNewAnalysis = async () => {
    try {
      setShowLoading(true);
      setLoadingInsights(true);
      
      // API request to trigger new analysis
      await apiRequest('POST', '/api/insights/analyze', undefined);
      
      // Fetch new insights
      const res = await apiRequest('GET', '/api/insights', undefined);
      const data = await res.json();
      
      setInsights(data);
      toast.success('New AI analysis completed successfully');
      
    } catch (error) {
      console.error('Failed to run new analysis:', error);
      toast.error('Failed to run new AI analysis');
    } finally {
      setLoadingInsights(false);
      setShowLoading(false);
    }
  };
  
  // Get a layer name by ID
  const getLayerName = (layerId?: string) => {
    if (!layerId || !terrainData) return 'Unknown';
    const layer = terrainData.layers.find(l => l.id === layerId);
    return layer ? layer.name : 'Unknown';
  };
  
  // Get an icon based on insight type
  const getInsightIcon = (type: InsightType) => {
    switch (type) {
      case InsightType.ANOMALY:
        return <AlertCircle className="text-orange-500" size={18} />;
      case InsightType.POTENTIAL_RESOURCE:
        return <Search className="text-emerald-500" size={18} />;
      case InsightType.STRUCTURAL_WEAKNESS:
        return <Layers className="text-red-500" size={18} />;
      case InsightType.DENSITY_VARIATION:
        return <TrendingUp className="text-blue-500" size={18} />;
      case InsightType.FAULT_LINE:
        return <Compass className="text-purple-500" size={18} />;
      default:
        return <Brain className="text-gray-500" size={18} />;
    }
  };
  
  // Get color based on severity
  const getSeverityColor = (severity: AIInsight['severity']) => {
    switch (severity) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-orange-500';
      case 'low':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };
  
  // Format confidence as percentage
  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}%`;
  };
  
  return (
    <div className="flex flex-col h-full text-sidebar-foreground">
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="text-sidebar-primary" size={20} />
          <h2 className="font-semibold text-lg">AI Insights</h2>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={requestNewAnalysis}
          disabled={isLoadingInsights}
          className="text-xs border-sidebar-border bg-sidebar-accent hover:bg-sidebar-accent/80"
        >
          {isLoadingInsights ? (
            <span className="flex items-center gap-1">
              <span className="loading-spinner w-3 h-3 border-2 border-current border-t-transparent rounded-full"></span>
              Analyzing...
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Zap size={14} />
              Run Analysis
            </span>
          )}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="flex-1 flex flex-col">
        <div className="px-4 py-2 border-b border-sidebar-border">
          <TabsList className="bg-sidebar-accent w-full grid grid-cols-3">
            <TabsTrigger value="all" className="text-xs">
              All
              <Badge variant="outline" className="ml-1 text-[10px] py-0 px-1.5 h-4">
                {insights.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value={InsightType.ANOMALY} className="text-xs">
              Anomalies
              <Badge variant="outline" className="ml-1 text-[10px] py-0 px-1.5 h-4">
                {insightCounts[InsightType.ANOMALY] || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value={InsightType.POTENTIAL_RESOURCE} className="text-xs">
              Resources
              <Badge variant="outline" className="ml-1 text-[10px] py-0 px-1.5 h-4">
                {insightCounts[InsightType.POTENTIAL_RESOURCE] || 0}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <TabsContent value={activeTab} className="m-0 p-0 h-full data-[state=active]:flex data-[state=active]:flex-col">
            <div className="flex-1 overflow-auto insights-panel p-4">
              {isLoadingInsights && showLoading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="loading-spinner w-10 h-10 border-4 border-sidebar-primary border-t-transparent rounded-full mb-4"></div>
                  <p className="text-sm text-sidebar-foreground/70">Running AI analysis...</p>
                </div>
              ) : filteredInsights.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-sidebar-foreground/70">
                  <Brain size={32} className="mb-2 opacity-50" />
                  <p>No insights available</p>
                  <p className="text-xs mt-1">Run analysis to generate insights</p>
                </div>
              ) : (
                <>
                  {filteredInsights.map((insight) => (
                    <div 
                      key={insight.id} 
                      className="mb-4 p-3 rounded-lg bg-sidebar-accent border border-sidebar-border"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <div className="mt-0.5">
                          {getInsightIcon(insight.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-sm">{insight.type.replace(/_/g, ' ')}</h3>
                            <Badge 
                              variant="outline" 
                              className={`text-[10px] ${getSeverityColor(insight.severity)}`}
                            >
                              {insight.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-xs text-sidebar-foreground/70 mt-0.5">
                            Location: {insight.location.x.toFixed(1)}, {insight.location.y.toFixed(1)}, {insight.location.z.toFixed(1)}
                          </p>
                          {insight.layerId && (
                            <p className="text-xs text-sidebar-foreground/70">
                              Layer: {getLayerName(insight.layerId)}
                            </p>
                          )}
                          <p className="text-xs mt-1">
                            <span className="font-semibold">Confidence:</span> {formatConfidence(insight.confidence)}
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-xs mt-2">{insight.description}</p>
                      
                      {insight.recommendation && (
                        <div className="mt-2 text-xs p-2 rounded bg-sidebar-background border border-sidebar-border">
                          <span className="font-semibold">Recommendation:</span> {insight.recommendation}
                        </div>
                      )}
                      
                      <div className="text-[10px] mt-2 text-sidebar-foreground/50">
                        {new Date(insight.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
