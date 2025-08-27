import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus, Users, BarChart3, Home, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Rank = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState<'composite' | 'profit'>('composite');

  // Sample leaderboard data
  const teams = [
    {
      rank: 1,
      teamName: "Team Blue Oak",
      members: ["Karan", "Meera"],
      roundScore: 85.4,
      cumulativeScore: 168.7,
      netProfit: 245000,
      marketShare: 28.5,
      csat: 82,
      trend: 'up' as const,
      rankChange: 0
    },
    {
      rank: 2,
      teamName: "Team Red Fox", 
      members: ["Riya", "Aditya"],
      roundScore: 78.2,
      cumulativeScore: 156.8,
      netProfit: 225000,
      marketShare: 25.2,
      csat: 78,
      trend: 'down' as const,
      rankChange: -1
    },
    {
      rank: 3,
      teamName: "Team Green Pine",
      members: ["Asha", "Vikram"],
      roundScore: 72.1,
      cumulativeScore: 145.3,
      netProfit: 198000,
      marketShare: 22.8,
      csat: 75,
      trend: 'up' as const,
      rankChange: 1
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <div className="h-6 w-6 flex items-center justify-center bg-muted rounded-full text-sm font-bold">{rank}</div>;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'same', change: number) => {
    if (change === 0) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-success" />;
    return <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  const sortedTeams = [...teams].sort((a, b) => {
    if (sortBy === 'composite') {
      return b.cumulativeScore - a.cumulativeScore;
    }
    return b.netProfit - a.netProfit;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Trophy className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Leaderboard</h1>
                <p className="text-muted-foreground">AegisCare SME Service Simulation</p>
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
              <Link to="/results/2">
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Results
                </Button>
              </Link>
              <Button>Export Rankings</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Round Status */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Practice Round</p>
                  <p className="font-semibold text-practice">Completed</p>
                </div>
                <Badge variant="outline" className="bg-practice text-practice-foreground">
                  Practice
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Round 1</p>
                  <p className="font-semibold text-round-1">Completed</p>
                </div>
                <Badge variant="outline" className="bg-round-1 text-round-1-foreground">
                  Scored
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Round 2</p>
                  <p className="font-semibold text-muted-foreground">Pending</p>
                </div>
                <Badge variant="secondary">
                  Upcoming
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Podium View for Top 3 */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {sortedTeams.slice(0, 3).map((team, index) => (
                <div 
                  key={team.teamName}
                  className={`text-center p-6 rounded-lg border-2 ${
                    index === 0 ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-950/20' :
                    index === 1 ? 'border-gray-300 bg-gray-50 dark:bg-gray-950/20' :
                    'border-amber-300 bg-amber-50 dark:bg-amber-950/20'
                  }`}
                >
                  <div className="flex justify-center mb-4">
                    {getRankIcon(team.rank)}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{team.teamName}</h3>
                  <div className="flex justify-center gap-1 mb-4">
                    {team.members.map((member, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {member}
                      </Badge>
                    ))}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Score</span>
                      <span className="font-bold">{team.cumulativeScore.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Profit</span>
                      <span className="font-medium">₹{(team.netProfit / 100000).toFixed(1)}L</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Market Share</span>
                      <span className="font-medium">{team.marketShare}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Rankings Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detailed Rankings</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant={sortBy === 'composite' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('composite')}
                >
                  Composite Score
                </Button>
                <Button 
                  variant={sortBy === 'profit' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSortBy('profit')}
                >
                  Net Profit
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="text-center">Trend</TableHead>
                  <TableHead className="text-right">Round Score</TableHead>
                  <TableHead className="text-right">Cumulative</TableHead>
                  <TableHead className="text-right">Net Profit</TableHead>
                  <TableHead className="text-right">Market Share</TableHead>
                  <TableHead className="text-right">CSAT</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTeams.map((team) => (
                  <TableRow key={team.teamName} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRankIcon(team.rank)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{team.teamName}</div>
                        <div className="flex gap-1 mt-1">
                          {team.members.map((member, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {member}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        {getTrendIcon(team.trend, team.rankChange)}
                        {team.rankChange !== 0 && (
                          <span className="text-xs text-muted-foreground">
                            {Math.abs(team.rankChange)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {team.roundScore.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {team.cumulativeScore.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{(team.netProfit / 100000).toFixed(1)}L
                    </TableCell>
                    <TableCell className="text-right">
                      {team.marketShare}%
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={team.csat >= 80 ? 'default' : team.csat >= 70 ? 'secondary' : 'destructive'}>
                        {team.csat}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Additional Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Active Teams</p>
                  <p className="text-xl font-bold">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">Avg Market Share</p>
                <p className="text-xl font-bold">25.5%</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Market Revenue</p>
                <p className="text-xl font-bold">₹18.2L</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div>
                <p className="text-sm text-muted-foreground">Avg CSAT</p>
                <p className="text-xl font-bold">78.3</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Note about scoring */}
        <Card className="border-muted">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Scoring Method:</strong> Composite score combines Net Profit (50%), Market Share (20%), 
              Customer Satisfaction (15%), Employee Satisfaction (10%), and ROCE (5%). 
              Practice rounds are not included in final rankings.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Rank;