import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, ArrowLeft, AlertTriangle, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Confirm = () => {
  const navigate = useNavigate();
  const [decisions, setDecisions] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentRound] = useState(1); // This would come from context/state

  useEffect(() => {
    // Load decisions from localStorage
    const storedDecisions = localStorage.getItem(`decisions_round_${currentRound}`);
    if (storedDecisions) {
      setDecisions(JSON.parse(storedDecisions));
    } else {
      // Redirect back to decision page if no decisions found
      navigate('/decision');
    }
  }, [currentRound, navigate]);

  const rounds = [
    { id: 1, name: "Practice", type: "practice", color: "practice" },
    { id: 2, name: "Round 1", type: "real", color: "round-1" },
    { id: 3, name: "Round 2", type: "real", color: "round-2" }
  ];

  const currentRoundInfo = rounds.find(r => r.id === currentRound);

  const handleConfirmSubmission = async () => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call to finalize submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark as finalized
      localStorage.setItem(`decisions_round_${currentRound}_finalized`, 'true');
      
      // Navigate to results
      navigate(`/results/${currentRound}`);
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!decisions) {
    return <div>Loading...</div>;
  }

  // Calculate provisional estimates
  const permCapacity = decisions.permHeadcount * 160;
  const totalCapacity = permCapacity + decisions.tempHours + decisions.outsourcedHours + (permCapacity * decisions.otCapPct / 100);
  const estimatedRevenue = {
    min: Math.round((decisions.priceRetail * 150 + decisions.priceSME * 80) / 1000) * 1000,
    max: Math.round((decisions.priceRetail * 200 + decisions.priceSME * 120) / 1000) * 1000
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-success" />
              <div>
                <h1 className="text-2xl font-bold">Confirm Your Decisions</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`bg-${currentRoundInfo?.color} text-${currentRoundInfo?.color}-foreground`}>
                    {currentRoundInfo?.name}
                  </Badge>
                  {currentRoundInfo?.type === 'practice' && (
                    <Badge variant="secondary">Practice Round</Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Link to="/">
                <Button variant="outline">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link to="/decision">
                <Button variant="outline">
                  Edit Decisions
                </Button>
              </Link>
              <Button 
                onClick={handleConfirmSubmission}
                disabled={isSubmitting}
                className="bg-success hover:bg-success/90"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm & Finalize'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {currentRoundInfo?.type === 'practice' && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This is a practice round. Your decisions will not affect your final leaderboard position.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Decision Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* HR Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Human Resources Decisions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Permanent Staff</span>
                      <span className="font-medium">{decisions.permHeadcount} employees</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Temporary Hours</span>
                      <span className="font-medium">{decisions.tempHours.toLocaleString()} hrs</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Training Intensity</span>
                      <span className="font-medium">{decisions.trainingIntensity}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pay Premium</span>
                      <span className="font-medium">{decisions.payPremiumPct}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Operations Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Operations Decisions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Outsourced Hours</span>
                      <span className="font-medium">{decisions.outsourcedHours.toLocaleString()} hrs</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Overtime Capacity</span>
                      <span className="font-medium">{decisions.otCapPct}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Strategy Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-primary mb-3">Retail Segment</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Price</span>
                          <span className="text-sm font-medium">₹{decisions.priceRetail.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Marketing</span>
                          <span className="text-sm font-medium">₹{decisions.marketingRetail.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-3">SME Segment</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Price</span>
                          <span className="text-sm font-medium">₹{decisions.priceSME.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Marketing</span>
                          <span className="text-sm font-medium">₹{decisions.marketingSME.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quality Investment</span>
                    <span className="font-medium">₹{decisions.qualityInvestment.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Decisions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Debt Change</span>
                      <span className="font-medium">
                        {decisions.debtChange > 0 ? '+' : ''}₹{decisions.debtChange.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dividend</span>
                      <span className="font-medium">₹{decisions.dividend.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Provisional Calculations */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Provisional Estimates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Permanent Capacity</span>
                    <span className="text-sm font-medium">{permCapacity.toLocaleString()} hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Capacity</span>
                    <span className="text-sm font-medium">{Math.round(totalCapacity).toLocaleString()} hrs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Est. Required Hours</span>
                    <span className="text-sm font-medium">1,200-1,800 hrs</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Est. Revenue</span>
                    <span className="text-sm font-medium">
                      ₹{(estimatedRevenue.min / 100000).toFixed(1)}-{(estimatedRevenue.max / 100000).toFixed(1)}L
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Est. Total Costs</span>
                    <span className="text-sm font-medium">₹3.2-4.1L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Est. Net Profit</span>
                    <span className="text-sm font-medium text-success">₹1.4-2.7L</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                These are provisional estimates only. Actual results depend on competitor actions 
                and will be calculated using game theory models when you finalize your submission.
              </AlertDescription>
            </Alert>

            <Card className="border-success">
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <CheckCircle className="h-12 w-12 text-success mx-auto" />
                  <h3 className="font-semibold">Ready to Submit</h3>
                  <p className="text-sm text-muted-foreground">
                    Once you confirm, your decisions will be finalized and sent to the simulation engine.
                  </p>
                  <Button 
                    onClick={handleConfirmSubmission}
                    disabled={isSubmitting}
                    className="w-full bg-success hover:bg-success/90"
                    size="lg"
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm & Finalize Submission'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirm;