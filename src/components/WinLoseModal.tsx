// components/WinLoseModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DBMovie } from "@/lib/movies";

export type WinStats = {
  livesLeft: number;
  wrongGuesses: number;
  hintUsed: boolean;
};

type Props = {
  open: boolean;
  status: "win" | "lose";
  dailyMovie?: DBMovie;
  winStats?: WinStats;
};

export default function WinLoseModal({ open, status, dailyMovie, winStats }: Props) {
  const isWin = status === "win";
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        className="
          sm:max-w-md
          data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
          data-[state=open]:duration-200 data-[state=closed]:duration-150
        "
      >
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-3xl text-center">
            {isWin ? "You got it!" : "Better luck tomorrow!"}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="space-y-2">
              <div className="text-center">
                {dailyMovie?.emojis.map((emoji, index) => (
                  <span key={index} className="text-3xl px-3 inline-block">
                    {emoji}
                  </span>
                ))}
              </div>
              <p className="text-center text-base">
                <span className="font-semibold text-foreground">{dailyMovie?.title}</span>
                {dailyMovie?.year && (
                  <span className="ml-1 text-muted-foreground font-medium">({dailyMovie.year})</span>
                )}
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        {isWin && winStats && (
          <div className="mt-4 rounded-2xl bg-muted/70 px-4 py-3 border border-muted-foreground/10">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase mb-2">
              Your stats
            </p>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Lives left</span>
                <span className="font-semibold tabular-nums">
                  {Array.from({ length: winStats.livesLeft }, () => "❤️").join(" ") || "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Wrong guesses</span>
                <span className="font-semibold tabular-nums">{winStats.wrongGuesses}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Hint used</span>
                <span className="font-semibold">{winStats.hintUsed ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-muted-foreground text-xs mt-4">
          Come back tomorrow to play again.
        </p>
      </DialogContent>
    </Dialog>
  );
}
