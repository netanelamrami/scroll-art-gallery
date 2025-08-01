import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Home, ArrowLeft, Info, Heart } from "lucide-react";

export const EventInactive = () => {
  const navigate = useNavigate();
  const { eventLink } = useParams();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating hearts */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Heart className="w-6 h-6 text-red-300" />
          </div>
        ))}
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute top-16 left-8 w-24 h-24 bg-gradient-to-r from-amber-200 to-orange-200 rounded-full opacity-30 animate-bounce" style={{animationDuration: '3s'}} />
      <div className="absolute bottom-24 right-12 w-20 h-20 bg-gradient-to-r from-red-200 to-pink-200 rounded-lg rotate-12 opacity-30 animate-pulse" />
      <div className="absolute top-1/4 right-1/3 w-16 h-16 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-full opacity-30 animate-ping" style={{animationDuration: '4s'}} />

      <Card className="max-w-lg w-full bg-white/95 backdrop-blur-sm shadow-2xl border-0 relative z-10">
        <CardHeader className="text-center pb-4">
          <div className="w-28 h-28 mx-auto mb-4 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg relative">
            <Calendar className="w-14 h-14 text-white" />
            <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
            האירוע הסתיים
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            האירוע שחיפשת כבר לא פעיל במערכת
          </p>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          {eventLink && (
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-l-4 border-amber-400">
              <p className="text-sm text-muted-foreground mb-1">קוד האירוع:</p>
              <code className="text-sm font-mono text-amber-700 break-all font-semibold">
                {eventLink}
              </code>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{currentTime.toLocaleString('he-IL')}</span>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-700 text-right">
                  <p className="font-semibold mb-2">למה האירוע לא פעיל?</p>
                  <ul className="space-y-1">
                    <li>• האירוע הסתיים והוסר מהמערכת</li>
                    <li>• מארגן האירוע ביטל אותו</li>
                    <li>• האירוע הועבר לארכיון</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">מה אפשר לעשות עכשיו?</h4>
              <ul className="text-sm text-green-700 space-y-1 text-right">
                <li>• פנה למארגן האירוע לקבלת התמונות</li>
                <li>• בדוק אם יש קישור חדש לאירוע</li>
                <li>• חזור לחפש אירועים אחרים</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex-1 hover:bg-amber-50 hover:border-amber-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              חזור
            </Button>
            <Button 
              onClick={() => navigate('/')}
              className="flex-1 bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600"
            >
              <Home className="w-4 h-4 mr-2" />
              דף הבית
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-muted-foreground">
              זכרונות יפים נשארים לנצח ❤️
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};