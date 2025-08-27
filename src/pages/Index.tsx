import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Building2, Users, Clock, Trophy, BookOpen, PlayCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  // Sample simulation state
  const simulationState = {
    currentRound: 1,
    roundsCompleted: 0,
    totalRounds: 3,
    teamName: "Team Red Fox",
    members: ["Riya", "Aditya"]
  };

  const rounds = [
    { id: 1, name: "Practice", type: "practice", status: "current", duration: 20 },
    { id: 2, name: "Round 1", type: "real", status: "upcoming", duration: 30 },
    { id: 3, name: "Round 2", type: "real", status: "upcoming", duration: 30 }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Building2 className="h-16 w-16 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                AegisCare SME Service Simulation
              </h1>
              <p className="text-xl text-muted-foreground mt-2">
                Operations Management & Game Theory Business Simulation
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Badge variant="outline" className="bg-practice text-practice-foreground">
                Practice + 2 Real Rounds
              </Badge>
              <Badge variant="outline">
                <Users className="h-3 w-3 mr-1" />
                Team-Based
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Team Status */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-background">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{simulationState.teamName}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Users className="h-4 w-4" />
                  {simulationState.members.join(", ")}
                </CardDescription>
              </div>
              <Trophy className="h-12 w-12 text-primary/60" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Simulation Progress</span>
                <span>{simulationState.roundsCompleted} of {simulationState.totalRounds} rounds completed</span>
              </div>
              <Progress value={(simulationState.roundsCompleted / simulationState.totalRounds) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/theory">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Study Theory</h3>
                    <p className="text-sm text-muted-foreground">Learn simulation mechanics & strategy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/decision">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-success/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <PlayCircle className="h-8 w-8 text-success" />
                  <div>
                    <h3 className="font-semibold">Make Decisions</h3>
                    <p className="text-sm text-muted-foreground">Submit your round decisions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/rank">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-warning/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Trophy className="h-8 w-8 text-warning" />
                  <div>
                    <h3 className="font-semibold">View Rankings</h3>
                    <p className="text-sm text-muted-foreground">Check team leaderboard</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Round Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Round Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rounds.map((round) => (
                <div key={round.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      round.status === 'current' ? 'bg-success' :
                      round.status === 'completed' ? 'bg-primary' :
                      'bg-muted'
                    }`} />
                    <div>
                      <h4 className="font-semibold">{round.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {round.type === 'practice' ? 'Practice Round - Not Scored' : 'Scored Round'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Duration: </span>
                      <span className="font-medium">{round.duration} mins</span>
                    </div>
                    <Badge variant={
                      round.status === 'current' ? 'default' :
                      round.status === 'completed' ? 'secondary' :
                      'outline'
                    }>
                      {round.status === 'current' ? 'Active' :
                       round.status === 'completed' ? 'Completed' :
                       'Upcoming'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Company Overview */}
        <Card>
          <CardHeader>
            <CardTitle>About AegisCare Services</CardTitle>
            <CardDescription>
              The business context for this simulation
            </CardDescription>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p className="mb-4">
              AegisCare is a small-medium enterprise providing after-sales service and maintenance 
              to consumer electronics retailers. You'll manage HR, capacity, pricing, marketing, 
              and quality investments across two competitive market segments.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Retail Segment</h4>
                <p className="text-sm">Quick turnaround warranty repairs for consumer electronics stores</p>
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">SME Segment</h4>
                <p className="text-sm">Specialized maintenance contracts for small-medium enterprises</p>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link to="/theory">
                <Button size="lg">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Learn More in Theory Section
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
