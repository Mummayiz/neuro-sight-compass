import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Eye, Scan, CheckCircle, Activity, BarChart3 } from 'lucide-react';
import { BehavioralQuestionnaire } from './BehavioralQuestionnaire';
import { EyeTrackingAssessment } from './EyeTrackingAssessment';
import { FacialAnalysisAssessment } from './FacialAnalysisAssessment';
import { AssessmentResults } from './AssessmentResults';
import heroImage from '@/assets/medical-ai-hero.jpg';

type AssessmentStage = 'intro' | 'questionnaire' | 'eyeTracking' | 'facialAnalysis' | 'results';

interface AssessmentData {
  questionnaire?: any;
  eyeTracking?: any;
  facialAnalysis?: any;
}

const ASDAssessment = () => {
  const [currentStage, setCurrentStage] = useState<AssessmentStage>('intro');
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({});
  const [progress, setProgress] = useState(0);

  const stages = [
    { id: 'questionnaire', title: 'Behavioral Questionnaire', icon: Brain, description: 'Answer questions about behavioral patterns' },
    { id: 'eyeTracking', title: 'Eye Tracking Analysis', icon: Eye, description: 'Real-time eye movement and fixation tracking' },
    { id: 'facialAnalysis', title: 'Facial Expression Analysis', icon: Scan, description: 'AI-powered facial pattern recognition' },
  ];

  const updateProgress = () => {
    const stageIndex = stages.findIndex(stage => stage.id === currentStage);
    setProgress(((stageIndex + 1) / stages.length) * 100);
  };

  const handleStageComplete = (stageData: any) => {
    setAssessmentData(prev => ({
      ...prev,
      [currentStage]: stageData
    }));

    const currentIndex = stages.findIndex(stage => stage.id === currentStage);
    if (currentIndex < stages.length - 1) {
      const nextStage = stages[currentIndex + 1].id as AssessmentStage;
      setCurrentStage(nextStage);
      updateProgress();
    } else {
      setCurrentStage('results');
      setProgress(100);
    }
  };

  const renderIntroduction = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden bg-gradient-medical shadow-medical">
        <img 
          src={heroImage} 
          alt="Advanced AI Medical Diagnostics" 
          className="w-full h-64 object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-accent/90 flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              ASD Detection Assessment
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Advanced AI-powered assessment combining behavioral analysis, eye tracking, and facial recognition for autism spectrum disorder evaluation.
            </p>
          </div>
        </div>
      </div>

      {/* Assessment Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        {stages.map((stage, index) => (
          <Card key={stage.id} className="shadow-card hover:shadow-medical transition-all duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-medical flex items-center justify-center mb-4">
                <stage.icon className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="flex items-center justify-center gap-2">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm font-semibold">
                  Stage {index + 1}
                </span>
                {stage.title}
              </CardTitle>
              <CardDescription>{stage.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Technology Features */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            AI Technologies Used
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Machine Learning Models</h4>
              <div className="space-y-2">
                <Badge variant="secondary">Random Forest</Badge>
                <Badge variant="secondary">Support Vector Machines</Badge>
                <Badge variant="secondary">Particle Swarm Optimization</Badge>
                <Badge variant="secondary">Convolutional Neural Networks</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Analysis Metrics</h4>
              <div className="space-y-2">
                <Badge variant="outline">Fixation Duration</Badge>
                <Badge variant="outline">Saccadic Movements</Badge>
                <Badge variant="outline">Blink Rate Analysis</Badge>
                <Badge variant="outline">Facial Expression Patterns</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button 
          size="lg"
          onClick={() => setCurrentStage('questionnaire')}
          className="bg-gradient-medical hover:shadow-glow transition-all duration-300"
        >
          Begin Assessment
        </Button>
      </div>
    </div>
  );

  const renderCurrentStage = () => {
    switch (currentStage) {
      case 'questionnaire':
        return <BehavioralQuestionnaire onComplete={handleStageComplete} />;
      case 'eyeTracking':
        return <EyeTrackingAssessment onComplete={handleStageComplete} />;
      case 'facialAnalysis':
        return <FacialAnalysisAssessment onComplete={handleStageComplete} />;
      case 'results':
        return <AssessmentResults data={assessmentData} />;
      default:
        return renderIntroduction();
    }
  };

  if (currentStage === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-6 py-8">
          {renderIntroduction()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        {/* Progress Header */}
        {currentStage !== 'results' && (
          <Card className="mb-8 shadow-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground">Assessment Progress</h2>
                <Badge variant="secondary">
                  Stage {stages.findIndex(s => s.id === currentStage) + 1} of {stages.length}
                </Badge>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                {stages.map((stage, index) => (
                  <span key={stage.id} className={
                    stages.findIndex(s => s.id === currentStage) >= index 
                      ? 'text-primary font-medium' 
                      : ''
                  }>
                    {stage.title}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Stage Content */}
        {renderCurrentStage()}
      </div>
    </div>
  );
};

export default ASDAssessment;