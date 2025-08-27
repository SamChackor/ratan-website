import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Clock, Users, Settings, TrendingUp, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Decision = () => {
  const navigate = useNavigate();
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [decisions, setDecisions] = useState({
    // HR Decisions
    permHeadcount: 10,
    tempHours: 200,
    trainingIntensity: 3,
    payPremiumPct: 5,
    
    // Capacity Decisions
    outsourcedHours: 50,
    otCapPct: 15,
    
    // Market Decisions
    priceRetail: 4000,
    priceSME: 6500,
    marketingRetail: 25000,
    marketingSME: 15000,
    qualityInvestment: 20000,
    
    // Finance Decisions
    debtChange: 0,
    dividend: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const rounds = [
    { id: 1, name: "Practice", type: "practice", duration: 20, color: "practice" },
    { id: 2, name: "Round 1", type: "real", duration: 30, color: "round-1" },
    { id: 3, name: "Round 2", type: "real", duration: 30, color: "round-2" }
  ];

  const currentRoundInfo = rounds.find(r => r.id === currentRound);

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateInputs = () => {
    const newErrors: Record<string, string> = {};
    
    if (decisions.priceRetail < 1000 || decisions.priceRetail > 10000) {
      newErrors.priceRetail = "Price must be between ₹1,000 and ₹10,000";
    }
    if (decisions.priceSME < 1000 || decisions.priceSME > 10000) {
      newErrors.priceSME = "Price must be between ₹1,000 and ₹10,000";
    }
    if (decisions.otCapPct > 50) {
      newErrors.otCapPct = "Overtime capacity cannot exceed 50%";
    }
    if (decisions.trainingIntensity > 10) {
      newErrors.trainingIntensity = "Training intensity scale is 0-10";
    }
    if (decisions.payPremiumPct > 20) {
      newErrors.payPremiumPct = "Pay premium cannot exceed 20%";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateInputs()) {
      // Store decisions in localStorage for now
      localStorage.setItem(`decisions_round_${currentRound}`, JSON.stringify(decisions));
      navigate('/confirm');
    }
  };

  const updateDecision = (field: string, value: number) => {
    setDecisions(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Round Info */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`bg-${currentRoundInfo?.color} text-${currentRoundInfo?.color}-foreground`}>
                  {currentRoundInfo?.name}
                </Badge>
                {currentRoundInfo?.type === 'practice' && (
                  <Badge variant="secondary">Not Scored</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-lg font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/theory">
                <Button variant="outline">View Theory</Button>
              </Link>
              <Button onClick={handleSubmit} disabled={timeLeft === 0}>
                Submit Decisions
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {timeLeft === 0 && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Time's up! This round is now closed. Please wait for results.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Decision Inputs */}
          <div className="lg:col-span-2 space-y-6">
            {/* HR Decisions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Human Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="permHeadcount">Permanent Staff Count</Label>
                  <Input
                    id="permHeadcount"
                    type="number"
                    value={decisions.permHeadcount}
                    onChange={(e) => updateDecision('permHeadcount', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tempHours">Temporary Hours</Label>
                  <Input
                    id="tempHours"
                    type="number"
                    value={decisions.tempHours}
                    onChange={(e) => updateDecision('tempHours', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trainingIntensity">Training Intensity (0-10)</Label>
                  <Input
                    id="trainingIntensity"
                    type="number"
                    value={decisions.trainingIntensity}
                    onChange={(e) => updateDecision('trainingIntensity', parseInt(e.target.value) || 0)}
                    min="0"
                    max="10"
                    className={errors.trainingIntensity ? 'border-destructive' : ''}
                  />
                  {errors.trainingIntensity && (
                    <p className="text-xs text-destructive">{errors.trainingIntensity}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payPremiumPct">Pay Premium (%)</Label>
                  <Input
                    id="payPremiumPct"
                    type="number"
                    value={decisions.payPremiumPct}
                    onChange={(e) => updateDecision('payPremiumPct', parseFloat(e.target.value) || 0)}
                    min="0"
                    max="20"
                    step="0.1"
                    className={errors.payPremiumPct ? 'border-destructive' : ''}
                  />
                  {errors.payPremiumPct && (
                    <p className="text-xs text-destructive">{errors.payPremiumPct}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Capacity Decisions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Operations & Capacity
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="outsourcedHours">Outsourced Hours</Label>
                  <Input
                    id="outsourcedHours"
                    type="number"
                    value={decisions.outsourcedHours}
                    onChange={(e) => updateDecision('outsourcedHours', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otCapPct">Overtime Capacity (%)</Label>
                  <Input
                    id="otCapPct"
                    type="number"
                    value={decisions.otCapPct}
                    onChange={(e) => updateDecision('otCapPct', parseFloat(e.target.value) || 0)}
                    min="0"
                    max="50"
                    step="0.1"
                    className={errors.otCapPct ? 'border-destructive' : ''}
                  />
                  {errors.otCapPct && (
                    <p className="text-xs text-destructive">{errors.otCapPct}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Market Decisions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Market Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary">Retail Segment</h4>
                    <div className="space-y-2">
                      <Label htmlFor="priceRetail">Price (₹)</Label>
                      <Input
                        id="priceRetail"
                        type="number"
                        value={decisions.priceRetail}
                        onChange={(e) => updateDecision('priceRetail', parseInt(e.target.value) || 0)}
                        min="1000"
                        max="10000"
                        className={errors.priceRetail ? 'border-destructive' : ''}
                      />
                      {errors.priceRetail && (
                        <p className="text-xs text-destructive">{errors.priceRetail}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="marketingRetail">Marketing Spend (₹)</Label>
                      <Input
                        id="marketingRetail"
                        type="number"
                        value={decisions.marketingRetail}
                        onChange={(e) => updateDecision('marketingRetail', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary">SME Segment</h4>
                    <div className="space-y-2">
                      <Label htmlFor="priceSME">Price (₹)</Label>
                      <Input
                        id="priceSME"
                        type="number"
                        value={decisions.priceSME}
                        onChange={(e) => updateDecision('priceSME', parseInt(e.target.value) || 0)}
                        min="1000"
                        max="10000"
                        className={errors.priceSME ? 'border-destructive' : ''}
                      />
                      {errors.priceSME && (
                        <p className="text-xs text-destructive">{errors.priceSME}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="marketingSME">Marketing Spend (₹)</Label>
                      <Input
                        id="marketingSME"
                        type="number"
                        value={decisions.marketingSME}
                        onChange={(e) => updateDecision('marketingSME', parseInt(e.target.value) || 0)}
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="qualityInvestment">Quality Investment (₹)</Label>
                  <Input
                    id="qualityInvestment"
                    type="number"
                    value={decisions.qualityInvestment}
                    onChange={(e) => updateDecision('qualityInvestment', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                  <p className="text-xs text-muted-foreground">
                    Improves service quality rating across both segments
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Finance Decisions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Decisions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="debtChange">Debt Change (₹)</Label>
                  <Input
                    id="debtChange"
                    type="number"
                    value={decisions.debtChange}
                    onChange={(e) => updateDecision('debtChange', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Positive = borrow, Negative = repay
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dividend">Dividend Payment (₹)</Label>
                  <Input
                    id="dividend"
                    type="number"
                    value={decisions.dividend}
                    onChange={(e) => updateDecision('dividend', parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current State Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current State</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Productivity</span>
                  <span className="text-sm font-medium">1.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Quality Rating</span>
                  <span className="text-sm font-medium">50</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cash</span>
                  <span className="text-sm font-medium">₹10,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Debt</span>
                  <span className="text-sm font-medium">₹0</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Provisional Estimates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Est. Required Hours</span>
                  <span className="text-sm font-medium">1,200</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Available Capacity</span>
                  <span className="text-sm font-medium">1,400</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Capacity Utilization</span>
                  <span className="text-sm font-medium text-success">86%</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Est. Revenue Range</span>
                  <span className="text-sm font-medium">₹4.5-6.8L</span>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Estimates are provisional and may change based on competitor actions. 
                Final results depend on game theory calculations.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Decision;