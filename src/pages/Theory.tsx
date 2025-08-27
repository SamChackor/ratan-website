import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, BookOpen, TrendingUp, Users, Target, Calculator } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Theory = () => {
  const [faqOpen, setFaqOpen] = useState<Record<string, boolean>>({});

  const toggleFaq = (key: string) => {
    setFaqOpen(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">AegisCare Simulation Theory</h1>
                <p className="text-muted-foreground">Operations Management & Game Theory</p>
              </div>
            </div>
            <Link to="/decision">
              <Button>Start Simulation</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Company Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              AegisCare Services Pvt Ltd
            </CardTitle>
            <CardDescription>
              Company Context & Business Model
            </CardDescription>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="text-lg mb-4">
              AegisCare is a small-medium enterprise providing after-sales service and maintenance 
              to consumer electronics retailers. The simulation models HR, capacity, pricing, 
              marketing, and quality investments across two competitive market segments: 
              <Badge variant="outline" className="mx-1">Retail</Badge> and 
              <Badge variant="outline" className="mx-1">SME</Badge>.
            </p>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Retail Segment</h4>
                <p className="text-sm">Consumer electronics stores requiring quick turnaround for warranty repairs</p>
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">SME Segment</h4>
                <p className="text-sm">Small-medium enterprises needing specialized maintenance contracts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Definitions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Key Business Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-primary mb-2">Market Share</h4>
                <p className="text-sm text-muted-foreground">Your percentage of total market demand captured through competitive pricing and service quality</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">Capacity Utilization</h4>
                <p className="text-sm text-muted-foreground">How effectively you use available service hours (permanent + temp + overtime)</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">CSAT (Customer Satisfaction)</h4>
                <p className="text-sm text-muted-foreground">Based on service quality, wait times, and SLA performance (0-100 scale)</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">ESAT (Employee Satisfaction)</h4>
                <p className="text-sm text-muted-foreground">Affected by training, workload, and pay premiums (0-100 scale)</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">ROCE (Return on Capital)</h4>
                <p className="text-sm text-muted-foreground">Net profit as percentage of capital employed - key efficiency metric</p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-2">Price Elasticity</h4>
                <p className="text-sm text-muted-foreground">How demand responds to price changes relative to competitors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How Simulation Works */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Simulation Flow & Game Theory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-practice/10 to-practice/5 p-6 rounded-lg border-l-4 border-practice">
                <h4 className="font-semibold text-practice mb-2">Practice Round (20 mins)</h4>
                <p className="text-sm">Learn the mechanics without affecting your final score</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-round-1/10 to-round-1/5 p-6 rounded-lg border-l-4 border-round-1">
                  <h4 className="font-semibold text-round-1 mb-2">Round 1 (30 mins)</h4>
                  <p className="text-sm">First scored round - establishes market position</p>
                </div>
                <div className="bg-gradient-to-r from-round-2/10 to-round-2/5 p-6 rounded-lg border-l-4 border-round-2">
                  <h4 className="font-semibold text-round-2 mb-2">Round 2 (30 mins)</h4>
                  <p className="text-sm">Final round - builds on Round 1 state</p>
                </div>
              </div>

              {/* Game Theory Nash Equilibrium */}
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h4 className="font-semibold mb-3">Nash Equilibrium Concept</h4>
                <p className="text-sm mb-4">
                  In each round, teams compete for market share. Your optimal strategy depends on 
                  what other teams do. A Nash equilibrium occurs when no team can improve their 
                  outcome by unilaterally changing their strategy.
                </p>
                <div className="bg-card p-4 rounded border">
                  <h5 className="font-medium mb-2">Market Share Formula:</h5>
                  <code className="text-xs bg-muted p-2 rounded block">
                    Score = exp(-η × RelativePrice) × (1 + μ × Marketing) × (1 + κ × Quality/100) × (1 - ρ × WaitPenalty)
                  </code>
                  <p className="text-xs text-muted-foreground mt-2">
                    Your market share = Your Score / Sum of All Team Scores
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Example */}
        <Card>
          <CardHeader>
            <CardTitle>Numeric Example</CardTitle>
            <CardDescription>How pricing, marketing, and quality combine</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 p-6 rounded-lg">
              <h4 className="font-semibold mb-4">Scenario: Retail Segment Competition</h4>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="bg-card p-4 rounded">
                  <h5 className="font-medium text-primary">Team A</h5>
                  <p className="text-xs">Price: ₹4,000</p>
                  <p className="text-xs">Marketing: ₹20,000</p>
                  <p className="text-xs">Quality: 60</p>
                </div>
                <div className="bg-card p-4 rounded">
                  <h5 className="font-medium text-round-1">Team B</h5>
                  <p className="text-xs">Price: ₹4,500</p>
                  <p className="text-xs">Marketing: ₹15,000</p>
                  <p className="text-xs">Quality: 75</p>
                </div>
                <div className="bg-card p-4 rounded">
                  <h5 className="font-medium text-round-2">Team C</h5>
                  <p className="text-xs">Price: ₹3,800</p>
                  <p className="text-xs">Marketing: ₹25,000</p>
                  <p className="text-xs">Quality: 50</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Result: Team C wins market share (42%) due to aggressive pricing and marketing, 
                despite lower quality. Team B gets premium segment (35%) with high quality. 
                Team A trails (23%) with balanced but unremarkable strategy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                key: "market-share",
                question: "What affects market share?",
                answer: "Market share is determined by your competitive score relative to other teams. Lower relative prices, higher marketing spend, better quality ratings, and shorter wait times all increase your market share."
              },
              {
                key: "csat",
                question: "How to improve CSAT?",
                answer: "Customer satisfaction improves with higher service quality, shorter wait times, meeting SLA commitments, and maintaining adequate capacity to serve demand promptly."
              },
              {
                key: "sla",
                question: "What is SLA?",
                answer: "Service Level Agreement - your commitment to complete service within specified timeframes (default 1 day). Missing SLA targets reduces CSAT and can lead to demand penalties."
              },
              {
                key: "capacity",
                question: "How does capacity planning work?",
                answer: "You balance permanent staff (160 hrs/month each), temporary hours, overtime (up to 50% of permanent capacity), and outsourcing. Insufficient capacity creates wait times and lost customers."
              }
            ].map(({ key, question, answer }) => (
              <Collapsible key={key} open={faqOpen[key]} onOpenChange={() => toggleFaq(key)}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between">
                    {question}
                    <ChevronDown className={`h-4 w-4 transition-transform ${faqOpen[key] ? 'rotate-180' : ''}`} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-4 pb-4">
                  <p className="text-sm text-muted-foreground">{answer}</p>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Theory;