import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Home, Calendar, ArrowLeft, Sparkles } from "lucide-react";

export const EventNotFound = () => {
  const navigate = useNavigate();
  const { eventLink } = useParams();
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Create sparkle animation
    const newSparkles = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setSparkles(newSparkles);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute animate-pulse"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: '3s'
            }}
          >
            <Sparkles className="w-4 h-4 text-purple-300 opacity-60" />
          </div>
        ))}
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20 animate-float" />
      <div className="absolute bottom-32 right-16 w-16 h-16 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg rotate-45 opacity-20 animate-float-delayed" />
      <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-r from-teal-200 to-cyan-200 rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}} />

      <Card className="max-w-md w-full bg-white/90 backdrop-blur-sm shadow-2xl border-0 relative z-10">
        <CardHeader className="text-center pb-4">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
            <Search className="w-12 h-12 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            אירוע לא נמצא
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            האירוע שחיפשת לא קיים במערכת
          </p>
        </CardHeader>

        <CardContent className="text-center space-y-6">
          {eventLink && (
            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-purple-400">
              <p className="text-sm text-muted-foreground mb-1">קישור האירוע:</p>
              <code className="text-sm font-mono text-purple-600 break-all">
                {eventLink}
              </code>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              ייתכן שהקישור שגוי או שהאירוע הוסר מהמערכת
            </p>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-700">מה אפשר לעשות?</h4>
              <ul className="text-sm text-muted-foreground space-y-1 text-right">
                <li>• בדוק שהקישור נכון</li>
                <li>• פנה למארגן האירוע</li>
                <li>• חזור לדף הבית</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex-1 hover:bg-purple-50 hover:border-purple-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              חזור
            </Button>
            <Button 
              onClick={() => navigate('/')}
              className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              <Home className="w-4 h-4 mr-2" />
              דף הבית
            </Button>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 6s ease-in-out infinite;
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};