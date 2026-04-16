import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Clock } from "lucide-react";

const EMOJIS = [
  { icon: "😔", label: "Sad" },
  { icon: "😐", label: "Neutral" },
  { icon: "🙂", label: "Okay" },
  { icon: "😊", label: "Happy" },
  { icon: "😄", label: "Great" },
];

interface Entry {
  practice: string;
  mood: string;
  gratitude: string;
  date: string;
}

const Index = () => {
  const [step, setStep] = useState(1);
  const [practice, setPractice] = useState("");
  const [mood, setMood] = useState("");
  const [gratitude, setGratitude] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(6);
  const [showHistory, setShowHistory] = useState(false);
  const [entries, setEntries] = useState<Entry[]>(() => {
    const saved = localStorage.getItem("yoga-journal-entries");
    return saved ? JSON.parse(saved) : [];
  });

  const reset = useCallback(() => {
    setStep(1);
    setPractice("");
    setMood("");
    setGratitude("");
    setSubmitted(false);
    setCountdown(6);
  }, []);

  const handleSubmit = () => {
    const entry: Entry = {
      practice,
      mood,
      gratitude,
      date: new Date().toLocaleString(),
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem("yoga-journal-entries", JSON.stringify(updated));
    setSubmitted(true);
  };

  useEffect(() => {
    if (!submitted) return;
    if (countdown <= 0) {
      reset();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [submitted, countdown, reset]);

  if (showHistory) {
    return (
      <div className="min-h-screen bg-background p-4 max-w-md mx-auto">
        <button onClick={() => setShowHistory(false)} className="flex items-center gap-1 text-muted-foreground mb-4">
          <ArrowLeft size={20} /> Back
        </button>
        <h2 className="text-xl font-semibold text-foreground mb-4">Past Entries</h2>
        {entries.length === 0 ? (
          <p className="text-muted-foreground text-center mt-12">No entries yet. Start journaling!</p>
        ) : (
          <div className="space-y-3">
            {entries.map((e, i) => (
              <div key={i} className="bg-card rounded-xl p-4 shadow-sm border border-border">
                <p className="text-xs text-muted-foreground mb-2">{e.date}</p>
                <p className="text-sm text-foreground"><span className="font-medium">Practice:</span> {e.practice}</p>
                <p className="text-sm text-foreground"><span className="font-medium">Mood:</span> {e.mood}</p>
                <p className="text-sm text-foreground"><span className="font-medium">Grateful for:</span> {e.gratitude}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-card rounded-2xl shadow-lg p-8 text-center border border-border">
          <div className="text-5xl mb-6">🧘</div>
          <p className="text-foreground text-lg leading-relaxed font-medium">
            Beautiful work showing up for yourself today! Every entry is a step toward a more mindful you. Keep going — you're doing amazing. ✨
          </p>
          <div className="mt-8">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 6) * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Returning in {countdown}s</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={reset} className="text-muted-foreground p-1">
          <ArrowLeft size={22} />
        </button>
        <p className="text-sm font-medium text-muted-foreground">MantraCare</p>
        <button onClick={() => setShowHistory(true)} className="text-muted-foreground p-1">
          <Clock size={22} />
        </button>
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full bg-primary transition-all duration-300 ${step >= s ? "w-full" : "w-0"}`}
            />
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        {step === 1 && (
          <>
            <h1 className="text-xl font-semibold text-foreground mb-1">How was your practice today?</h1>
            <p className="text-sm text-muted-foreground mb-5">Take a moment to reflect</p>
            <textarea
              value={practice}
              onChange={(e) => setPractice(e.target.value)}
              placeholder="Share how your yoga or mindfulness practice went today..."
              className="w-full h-32 rounded-xl bg-secondary border-none p-4 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={() => setStep(2)}
              className="w-full mt-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Next
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-xl font-semibold text-foreground mb-1">How are you feeling right now?</h1>
            <p className="text-sm text-muted-foreground mb-5">Tap the emoji that matches your mood</p>
            <div className="flex justify-between mb-6">
              {EMOJIS.map((e) => (
                <button
                  key={e.icon}
                  onClick={() => setMood(e.icon)}
                  className={`text-3xl p-3 rounded-xl transition-all ${
                    mood === e.icon ? "bg-accent scale-110 shadow-sm" : "hover:bg-secondary"
                  }`}
                >
                  {e.icon}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(3)}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Next
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="text-xl font-semibold text-foreground mb-1">What's one thing you're grateful for today?</h1>
            <p className="text-sm text-muted-foreground mb-5">It can be anything, big or small</p>
            <textarea
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="Write freely here..."
              className="w-full h-32 rounded-xl bg-secondary border-none p-4 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleSubmit}
              className="w-full mt-5 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Submit
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
