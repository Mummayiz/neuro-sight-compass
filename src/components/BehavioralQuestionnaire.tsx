import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Brain, ChevronRight, ChevronLeft } from 'lucide-react';

interface QuestionnaireProps {
  onComplete: (data: any) => void;
}

const questions = [
  {
    id: 1,
    category: "Social Communication",
    question: "How often does the individual make eye contact during conversations?",
    options: [
      { value: 0, label: "Always maintains appropriate eye contact" },
      { value: 1, label: "Usually makes eye contact" },
      { value: 2, label: "Sometimes avoids eye contact" },
      { value: 3, label: "Rarely or never makes eye contact" }
    ]
  },
  {
    id: 2,
    category: "Social Communication",
    question: "How does the individual respond to their name being called?",
    options: [
      { value: 0, label: "Always responds immediately" },
      { value: 1, label: "Usually responds" },
      { value: 2, label: "Sometimes responds with delay" },
      { value: 3, label: "Rarely or never responds" }
    ]
  },
  {
    id: 3,
    category: "Repetitive Behaviors",
    question: "Does the individual engage in repetitive movements or behaviors?",
    options: [
      { value: 0, label: "No repetitive behaviors observed" },
      { value: 1, label: "Occasional repetitive behaviors" },
      { value: 2, label: "Frequent repetitive behaviors" },
      { value: 3, label: "Constant repetitive behaviors that interfere with daily activities" }
    ]
  },
  {
    id: 4,
    category: "Sensory Processing",
    question: "How does the individual react to sensory stimuli (sounds, lights, textures)?",
    options: [
      { value: 0, label: "Typical reactions to sensory input" },
      { value: 1, label: "Mild sensitivity to some stimuli" },
      { value: 2, label: "Moderate over- or under-sensitivity" },
      { value: 3, label: "Severe sensory sensitivities affecting daily life" }
    ]
  },
  {
    id: 5,
    category: "Social Interaction",
    question: "How well does the individual engage in interactive play or activities?",
    options: [
      { value: 0, label: "Actively seeks and enjoys interactive play" },
      { value: 1, label: "Participates when encouraged" },
      { value: 2, label: "Limited interest in interactive activities" },
      { value: 3, label: "Avoids or shows no interest in interactive play" }
    ]
  },
  {
    id: 6,
    category: "Communication",
    question: "How does the individual use gestures and nonverbal communication?",
    options: [
      { value: 0, label: "Uses gestures naturally and appropriately" },
      { value: 1, label: "Uses some gestures with prompting" },
      { value: 2, label: "Limited use of gestures" },
      { value: 3, label: "Does not use gestures for communication" }
    ]
  }
];

export const BehavioralQuestionnaire: React.FC<QuestionnaireProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calculate scores by category
      const categoryScores = questions.reduce((acc, question) => {
        const category = question.category;
        const score = answers[question.id] || 0;
        if (!acc[category]) acc[category] = [];
        acc[category].push(score);
        return acc;
      }, {} as Record<string, number[]>);

      const results = Object.entries(categoryScores).map(([category, scores]) => ({
        category,
        score: scores.reduce((sum, score) => sum + score, 0),
        maxScore: scores.length * 3,
        percentage: (scores.reduce((sum, score) => sum + score, 0) / (scores.length * 3)) * 100
      }));

      const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
      const maxTotalScore = questions.length * 3;

      onComplete({
        answers,
        categoryScores: results,
        totalScore,
        maxTotalScore,
        riskLevel: totalScore / maxTotalScore > 0.6 ? 'High' : 
                   totalScore / maxTotalScore > 0.3 ? 'Medium' : 'Low'
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const current = questions[currentQuestion];
  const hasAnswer = answers[current.id] !== undefined;

  return (
    <Card className="max-w-4xl mx-auto shadow-medical">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          Behavioral Assessment Questionnaire
        </CardTitle>
        <CardDescription>
          Please answer each question based on your observations. This assessment helps identify behavioral patterns associated with ASD.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Current Question */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {current.category}
            </div>
            <h3 className="text-xl font-semibold text-foreground leading-relaxed">
              {current.question}
            </h3>
          </div>

          {/* Answer Options */}
          <RadioGroup
            value={answers[current.id]?.toString()}
            onValueChange={(value) => handleAnswer(current.id, parseInt(value))}
            className="space-y-3"
          >
            {current.options.map((option) => (
              <div key={option.value} className="flex items-start space-x-3 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
                <RadioGroupItem 
                  value={option.value.toString()} 
                  id={`option-${option.value}`}
                  className="mt-0.5" 
                />
                <Label 
                  htmlFor={`option-${option.value}`}
                  className="flex-1 text-base leading-relaxed cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={!hasAnswer}
            className="flex items-center gap-2 bg-gradient-medical hover:shadow-glow transition-all duration-300"
          >
            {currentQuestion === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};