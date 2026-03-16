// components/WinLoseModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DBMovie } from "@/lib/movies";

type Props = {
  open: boolean;
  status: "win" | "lose";
  dailyMovie?: DBMovie;
  onClose: () => void;
  onPlayAgain: () => void;
};

export default function WinLoseModal({ open, status, dailyMovie, onClose, onPlayAgain }: Props) {
  const isWin = status === "win";
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        // shadcn includes data-state classes; these add smooth transitions
        className="
          sm:max-w-md
          data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
          data-[state=open]:duration-200 data-[state=closed]:duration-150
        "
      >
        <DialogHeader>
          <DialogTitle className={"text-3xl text-center"}>{isWin ? "You got it!" : "Better luck tomorrow!"}</DialogTitle>
          <DialogDescription>
            <div className="text-center">
              {dailyMovie?.emojis.map((emoji, index) => (
                <p key={index} className="text-3xl px-3 inline-block">
                  {emoji}
                </p>
              ))}
            </div>
            <p className="text-center text-lg">{`${dailyMovie?.title} (${dailyMovie?.year})`}</p>
          </DialogDescription>
        </DialogHeader>

        {/* Optional: show the answer / stats here */}
        <div className="mt-2 rounded-xl bg-muted p-4 text-sm">{/* e.g., Answer, guesses, streak */}</div>

        <DialogFooter className="gap-2">
          {!isWin && (
            <Button variant="secondary" onClick={onClose}>
              Hide
            </Button>
          )}
          <Button onClick={onPlayAgain}>{isWin ? "Play Again" : "Try Another"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
