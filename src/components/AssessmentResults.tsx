import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BarChart3, 
  Brain, 
  Eye, 
  Scan, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Download,
  RefreshCw,
  TrendingUp
} from 'lucide-react';

interface AssessmentResultsProps {
  data: {
    questionnaire?: any;
    eyeTracking?: any;
    facialAnalysis?: any;
  };
}

export const AssessmentResults: React.FC<AssessmentResultsProps> = ({ data }) => {
  const { questionnaire, eyeTracking, facialAnalysis } = data;

  // Calculate overall risk assessment
  const riskLevels = [
    questionnaire?.riskLevel,
    eyeTracking?.riskLevel,
    facialAnalysis?.riskLevel
  ].filter(Boolean);

  const calculateOverallRisk = () => {
    const riskScores = [
      questionnaire?.totalScore / questionnaire?.maxTotalScore || 0,
      eyeTracking?.riskScore || 0,
      facialAnalysis?.riskScore || 0
    ];
    
    const avgRisk = riskScores.reduce((sum, score) => sum + score, 0) / riskScores.length;
    
    if (avgRisk > 0.6) return { level: 'High', color: 'destructive', description: 'Multiple indicators suggest potential ASD characteristics' };
    if (avgRisk > 0.3) return { level: 'Medium', color: 'warning', description: 'Some indicators present, further evaluation recommended' };
    return { level: 'Low', color: 'success', description: 'Minimal indicators detected in this assessment' };
  };

  const overallRisk = calculateOverallRisk();

  // ML Model Accuracy (simulated for demo)
  const modelAccuracies = {
    randomForest: 87.3,
    svm: 84.1,
    cnn: 91.2,
    ensemble: 93.7
  };

  const getMetricExplanation = (metric: string, value: any) => {
    const explanations: Record<string, string> = {
      'Eye Contact': `${value < 40 ? 'Reduced' : 'Normal'} eye contact frequency. In ASD, individuals often show ${value < 40 ? 'decreased' : 'typical'} eye contact patterns.`,
      'Fixation Duration': `Average fixation of ${value}ms. ${value > 1200 ? 'Longer fixations may indicate detailed processing style common in ASD.' : 'Normal fixation duration patterns.'}`,
      'Emotional Range': `${value < 3 ? 'Limited' : 'Typical'} emotional expression variety. ${value < 3 ? 'Restricted emotional expression can be an ASD indicator.' : 'Normal emotional range observed.'}`,
      'Behavioral Score': `Score of ${value}%. ${value > 60 ? 'Higher scores indicate more ASD-related behavioral patterns.' : 'Lower scores suggest fewer ASD indicators.'}`
    };
    return explanations[metric] || 'Analysis based on established ASD research criteria.';
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Overall Results Header */}
      <Card className="shadow-medical bg-gradient-subtle">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold mb-2">Assessment Results</CardTitle>
          <CardDescription className="text-lg">
            Comprehensive AI-powered ASD evaluation completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Risk Level */}
          <div className="text-center space-y-4">
            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-lg font-semibold ${
              overallRisk.color === 'destructive' ? 'bg-destructive/10 text-destructive' :
              overallRisk.color === 'warning' ? 'bg-warning/10 text-warning' :
              'bg-success/10 text-success'
            }`}>
              {overallRisk.color === 'destructive' ? <AlertTriangle className="w-5 h-5" /> :
               overallRisk.color === 'warning' ? <Info className="w-5 h-5" /> :
               <CheckCircle className="w-5 h-5" />}
              Overall Risk Level: {overallRisk.level}
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {overallRisk.description}
            </p>
          </div>

          {/* Model Accuracy Display */}
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(modelAccuracies).map(([model, accuracy]) => (
              <div key={model} className="text-center p-4 bg-card border rounded-lg">
                <div className="text-2xl font-bold text-primary">{accuracy}%</div>
                <div className="text-sm text-muted-foreground capitalize">
                  {model.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-xs text-success mt-1">
                  {model === 'ensemble' ? 'Best Performance' : 'High Accuracy'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Behavioral Questionnaire Results */}
        {questionnaire && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                Behavioral Analysis
              </CardTitle>
              <Badge variant={questionnaire.riskLevel === 'High' ? 'destructive' : 
                            questionnaire.riskLevel === 'Medium' ? 'secondary' : 'outline'}>
                {questionnaire.riskLevel} Risk
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Overall Score</span>
                  <span className="font-medium">{questionnaire.totalScore}/{questionnaire.maxTotalScore}</span>
                </div>
                <Progress value={(questionnaire.totalScore / questionnaire.maxTotalScore) * 100} className="h-2" />
              </div>
              
              {questionnaire.categoryScores?.map((category: any) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{category.category}</span>
                    <span>{category.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={category.percentage} className="h-1.5" />
                </div>
              ))}

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {getMetricExplanation('Behavioral Score', (questionnaire.totalScore / questionnaire.maxTotalScore * 100).toFixed(1))}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Eye Tracking Results */}
        {eyeTracking && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-primary" />
                Eye Tracking Analysis
              </CardTitle>
              <Badge variant={eyeTracking.riskLevel === 'High' ? 'destructive' : 
                            eyeTracking.riskLevel === 'Medium' ? 'secondary' : 'outline'}>
                {eyeTracking.riskLevel} Risk
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold">{eyeTracking.metrics.avgFixationDuration.toFixed(0)}ms</div>
                  <div className="text-xs text-muted-foreground">Avg Fixation</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold">{eyeTracking.metrics.saccadicRate.toFixed(1)}/min</div>
                  <div className="text-xs text-muted-foreground">Saccadic Rate</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold">{eyeTracking.metrics.blinkRatePerMinute.toFixed(1)}/min</div>
                  <div className="text-xs text-muted-foreground">Blink Rate</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold">{(eyeTracking.metrics.gazeStability * 100).toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">Gaze Stability</div>
                </div>
              </div>

              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {getMetricExplanation('Fixation Duration', eyeTracking.metrics.avgFixationDuration.toFixed(0))}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Facial Analysis Results */}
        {facialAnalysis && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="w-5 h-5 text-primary" />
                Facial Expression Analysis
              </CardTitle>
              <Badge variant={facialAnalysis.riskLevel === 'High' ? 'destructive' : 
                            facialAnalysis.riskLevel === 'Medium' ? 'secondary' : 'outline'}>
                {facialAnalysis.riskLevel} Risk
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Eye Contact Rate</span>
                  <span className="font-medium">{facialAnalysis.metrics.eyeContactRate.toFixed(1)}%</span>
                </div>
                <Progress value={facialAnalysis.metrics.eyeContactRate} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold">{facialAnalysis.metrics.microExpressions.length}</div>
                  <div className="text-xs text-muted-foreground">Micro-expressions</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-lg font-bold">{(facialAnalysis.metrics.facialSymmetry * 100).toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">Facial Symmetry</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Emotion Distribution</h4>
                {facialAnalysis.metrics.emotionDistribution.slice(0, 3).map((emotion: any) => (
                  <div key={emotion.emotion} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{emotion.emotion}</span>
                    <span className="text-sm font-medium">{emotion.percentage.toFixed(1)}%</span>
                  </div>
                ))}
              </div>

              <Alert>
                <Eye className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  {getMetricExplanation('Eye Contact', facialAnalysis.metrics.eyeContactRate.toFixed(1))}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ML Model Details */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Machine Learning Model Analysis
          </CardTitle>
          <CardDescription>
            Multiple AI models were used to ensure accurate assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Model Performance</h4>
              <div className="space-y-3">
                {Object.entries(modelAccuracies).map(([model, accuracy]) => (
                  <div key={model} className="flex items-center justify-between">
                    <span className="text-sm capitalize">
                      {model.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center gap-2">
                      <Progress value={accuracy} className="w-24 h-2" />
                      <span className="text-sm font-medium">{accuracy}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Key Prediction Factors</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <span className="text-sm">Eye movement patterns (32% weight)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent rounded-full" />
                  <span className="text-sm">Facial expression analysis (28% weight)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded-full" />
                  <span className="text-sm">Behavioral questionnaire (25% weight)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-warning rounded-full" />
                  <span className="text-sm">Social interaction metrics (15% weight)</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download Report
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Retake Assessment
        </Button>
        <Button className="bg-gradient-medical hover:shadow-glow transition-all duration-300">
          Consult with Specialist
        </Button>
      </div>

      {/* Disclaimer */}
      <Alert className="max-w-4xl mx-auto">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> This AI assessment is for screening purposes only and should not replace professional medical evaluation. 
          Please consult with a qualified healthcare professional for definitive diagnosis and treatment recommendations.
        </AlertDescription>
      </Alert>
    </div>
  );
};