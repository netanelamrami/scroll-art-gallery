import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const EventNotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-sm w-full bg-card border">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl font-bold text-foreground">
            אירוע לא נמצא
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center">
          <p className="text-muted-foreground text-sm">
            האירוע שחיפשת לא קיים במערכת
          </p>
        </CardContent>
      </Card>
    </div>
  );
};