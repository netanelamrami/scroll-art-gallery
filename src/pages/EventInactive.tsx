import { Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const EventInactive = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-sm w-full bg-card border">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center relative">
            <Calendar className="w-8 h-8 text-white" />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
              <Clock className="w-3 h-3 text-destructive-foreground" />
            </div>
          </div>
          <CardTitle className="text-xl font-bold text-foreground">
            האירוע הסתיים
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center">
          <p className="text-muted-foreground text-sm">
            האירוע שחיפשת כבר לא פעיל במערכת
          </p>
        </CardContent>
      </Card>
    </div>
  );
};