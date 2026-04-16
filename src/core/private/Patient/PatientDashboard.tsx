import { Link } from "react-router-dom";
import { useAuth } from "@/components/ContextApi/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CalendarCheck,
  Clock,
  Heart,
  Stethoscope,
  ArrowRight,
  FileText,
  Bell,
} from "lucide-react";

export default function PatientDashboard() {
  const { user } = useAuth();
  const welcomeName = user?.firstName ?? user?.fullName?.split(" ")[0] ?? "Patient";

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="rounded-xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-cyan-500/10 dark:from-emerald-600/20 dark:via-teal-600/15 dark:to-cyan-600/15 border border-emerald-500/20 p-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Hello, {welcomeName}!
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here’s your health dashboard. Manage appointments and stay on top of your care.
        </p>
      </div>

      {/* Quick stats (static placeholders) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border overflow-hidden">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">—</p>
              <p className="text-xs text-muted-foreground">Upcoming</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border overflow-hidden">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <CalendarCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">—</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border overflow-hidden">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">—</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border overflow-hidden">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-violet-500/15 flex items-center justify-center">
              <FileText className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">—</p>
              <p className="text-xs text-muted-foreground">Records</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions + Next appointment */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              Quick actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Button asChild variant="default" className="h-auto py-4 justify-start gap-3">
              <Link to="/my-appointments?tab=book">
                <Calendar className="h-5 w-5" />
                <span>Book new appointment</span>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 justify-start gap-3">
              <Link to="/my-appointments">
                <Clock className="h-5 w-5" />
                <span>View my appointments</span>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              Next appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted/50 border border-border p-4 text-center">
              <p className="text-sm text-muted-foreground">No upcoming appointment</p>
              <Button asChild variant="link" size="sm" className="mt-2">
                <Link to="/my-appointments?tab=book">Book one now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health at a glance (static placeholder) */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Heart className="h-4 w-4 text-primary" />
            Health at a glance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Last visit</p>
              <p className="mt-1 text-sm text-foreground">—</p>
            </div>
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Next follow-up</p>
              <p className="mt-1 text-sm text-foreground">—</p>
            </div>
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preferred clinic</p>
              <p className="mt-1 text-sm text-foreground">—</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
