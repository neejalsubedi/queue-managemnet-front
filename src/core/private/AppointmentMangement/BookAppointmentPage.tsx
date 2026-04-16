import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import BookAppointmentTab from "./tabs/BookAppointmentTab";

export default function BookAppointmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild aria-label="Back to appointments">
          <Link to="/appointment-management">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Book Appointment</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Create a new appointment. Select a patient and fill in the details.
          </p>
        </div>
      </div>
      <BookAppointmentTab />
    </div>
  );
}
