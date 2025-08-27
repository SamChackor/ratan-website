import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, BarChart3, PieChart, Download, Users, Home, ArrowLeft } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Cell, Pie,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const Results = () => {
  const { roundId } = useParams();
  const navigate = useNavigate();
  const currentRoundId = parseInt(roundId || '1');

  const rounds = [
    { id: 1, name: "Practice", type: "practice", color: "practice" },
    { id: 2, name: "Round 1", type: "real", color: "round-1" },
    { id: 3, name: "Round 2", type: "real", color: "round-2" }
  ];

  const currentRoundInfo = rounds.find(r => r.id === currentRoundId);

  // Sample results data
  const results = {
    unitsServed: { retail: 185, sme: 95 },
    revenue: 650000,
    costs: {
      hr: 180000,
      operations: 95000,
      marketing: 40000,
      quality: 20000,
      outsourcing: 75000,
      fixed: 300000
    },
    netProfit: 125000,
    marketShare: { retail: 0.24, sme: 0.18 },
    csat: 78,
    esat: 82,
    roce: 15.8,
    profitPerEmployee: 12500
  };

  const totalCosts = Object.values(results.costs).reduce((a, b) => a + b, 0);

  // Chart data
  const revenueData = [
    { round: 'Practice', revenue: 0, profit: 0 },
    { round: 'Round 1', revenue: 650000, profit: 125000 },
    { round: 'Round 2', revenue: 0, profit: 0 }
  ];

  const costBreakdown = [
    { name: 'HR Costs', value: results.costs.hr, color: '#3B82F6' },
    { name: 'Operations', value: results.costs.operations, color: '#10B981' },
    { name: 'Marketing', value: results.costs.marketing, color: '#8B5CF6' },
    { name: 'Quality', value: results.costs.quality, color: '#F59E0B' },
    { name: 'Outsourcing', value: results.costs.outsourcing, color: '#EF4444' },
    { name: 'Fixed Overhead', value: results.costs.fixed, color: '#6B7280' }
  ];

  const unitsData = [
    { segment: 'Retail', served: results.unitsServed.retail, competitor1: 165, competitor2: 140 },
    { segment: 'SME', served: results.unitsServed.sme, competitor1: 88, competitor2: 102 }
  ];

  const radarData = [
    { metric: 'CSAT', value: results.csat, fullMark: 100 },
    { metric: 'ESAT', value: results.esat, fullMark: 100 },
    { metric: 'Quality', value: 65, fullMark: 100 },
    { metric: 'Service Level', value: 85, fullMark: 100 },
    { metric: 'Market Share', value: 21, fullMark: 50 },
    { metric: 'Efficiency', value: 78, fullMark: 100 }
  ];

  const insights = [
    "High marketing spend in retail segment drove strong market share gains (+6% vs competitors)",
    "Overtime costs exceeded budget by 15% due to underestimated demand in SME segment", 
    "CSAT improved by 8 points from previous round due to quality investments"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Round Results</h1>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={`bg-${currentRoundInfo?.color} text-${currentRoundInfo?.color}-foreground`}>
                    {currentRoundInfo?.name}
                  </Badge>
                  {currentRoundInfo?.type === 'practice' && (
                    <Badge variant="secondary">Practice - Not Counted</Badge>
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
              <Link to="/rank">
                <Button variant="outline">View Leaderboard</Button>
              </Link>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-lg font-bold">₹{(results.revenue / 100000).toFixed(1)}L</p>
                </div>
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Net Profit</p>
                  <p className="text-lg font-bold text-success">₹{(results.netProfit / 100000).toFixed(1)}L</p>
                </div>
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-xs text-muted-foreground">Market Share</p>
                <p className="text-lg font-bold">{((results.marketShare.retail + results.marketShare.sme) / 2 * 100).toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-xs text-muted-foreground">CSAT</p>
                <p className="text-lg font-bold">{results.csat}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-xs text-muted-foreground">ESAT</p>
                <p className="text-lg font-bold">{results.esat}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-xs text-muted-foreground">ROCE</p>
                <p className="text-lg font-bold">{results.roce}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Revenue & Profit Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Profit Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="round" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${(Number(value) / 100000).toFixed(1)}L`} />
                  <Line type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                  <Line type="monotone" dataKey="profit" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={costBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ₹${(Number(value) / 1000).toFixed(0)}K`}
                  >
                    {costBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${(Number(value) / 1000).toFixed(0)}K`} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Units Served by Segment */}
          <Card>
            <CardHeader>
              <CardTitle>Units Served vs Competitors</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={unitsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="segment" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="served" fill="hsl(var(--chart-1))" name="Your Team" />
                  <Bar dataKey="competitor1" fill="hsl(var(--chart-3))" name="Competitor 1" />
                  <Bar dataKey="competitor2" fill="hsl(var(--chart-4))" name="Competitor 2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Radar */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar 
                    name="Performance" 
                    dataKey="value" 
                    stroke="hsl(var(--chart-1))" 
                    fill="hsl(var(--chart-1))" 
                    fillOpacity={0.3} 
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Financial Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Revenue</span>
                <span className="font-medium">₹{results.revenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Costs</span>
                <span className="font-medium">₹{totalCosts.toLocaleString()}</span>
              </div>
              <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Net Profit</span>
                  <span className="font-bold text-success">₹{results.netProfit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profit Margin</span>
                  <span className="font-medium">{(results.netProfit / results.revenue * 100).toFixed(1)}%</span>
                </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ROCE</span>
                <span className="font-medium">{results.roce}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profit per Employee</span>
                <span className="font-medium">₹{results.profitPerEmployee.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Market Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Market Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Retail Segment</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Units Served</span>
                    <span>{results.unitsServed.retail}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Market Share</span>
                    <span>{(results.marketShare.retail * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-semibold mb-2">SME Segment</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Units Served</span>
                    <span>{results.unitsServed.sme}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Market Share</span>
                    <span>{(results.marketShare.sme * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Overall CSAT</span>
                  <span className="font-medium">{results.csat}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Employee Satisfaction</span>
                  <span className="font-medium">{results.esat}/100</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="p-3 bg-secondary/50 rounded-lg">
                  <p className="text-sm">{insight}</p>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Recommendations</h4>
                <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Consider increasing permanent staff to reduce overtime costs</li>
                  <li>SME segment shows growth potential - increase marketing allocation</li>
                  <li>Quality investments are yielding positive CSAT returns</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Results;