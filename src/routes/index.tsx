import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X, User, Search, Bookmark } from "lucide-react";
import { NEWS, type NewsItem } from "@/data/news";
import { SwipeCard } from "@/components/SwipeCard";
import { ArticleSheet } from "@/components/ArticleSheet";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stimme Swipe — News, die zu dir passt" },
      {
        name: "description",
        content:
          "Swipe-basierter News-Reader der Heilbronner Stimme. In 60 Wörtern informiert — entscheide selbst, was dich interessiert.",
      },
      { property: "og:title", content: "Stimme Swipe" },
      {
        property: "og:description",
        content: "News zum Swipen — aus Heilbronn und der Region.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<NewsItem[]>([]);
  const [openArticle, setOpenArticle] = useState<NewsItem | null>(null);
  const [feedback, setFeedback] = useState<"left" | "right" | null>(null);

  const deck = useMemo(() => NEWS, []);
  const visible = deck.slice(index, index + 3).reverse(); // top last (renders last)

  const handleSwipe = (dir: "left" | "right") => {
    setFeedback(dir);
    setTimeout(() => setFeedback(null), 350);
    if (dir === "right") {
      setLiked((l) => [deck[index], ...l]);
    }
    setIndex((i) => i + 1);
  };

  const reset = () => {
    setIndex(0);
    setLiked([]);
  };

  return (
    <div className="relative mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="z-20 flex shrink-0 items-center justify-between px-5 pb-3 pt-5">
        <button className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-secondary-foreground">
          <User className="h-5 w-5" />
        </button>
        <div className="flex flex-col items-center leading-none">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Heilbronner
          </span>
          <span className="font-display text-2xl font-black text-primary">
            Stimme<span className="text-foreground">·Swipe</span>
          </span>
        </div>
        <button className="relative grid h-10 w-10 place-items-center rounded-full bg-secondary text-secondary-foreground">
          <Bookmark className="h-5 w-5" />
          {liked.length > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {liked.length}
            </span>
          )}
        </button>
      </header>

      {/* Category pills */}
      <div className="z-10 flex shrink-0 gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {["Für dich", "Lokal", "Sport", "Politik", "Kultur", "Wirtschaft"].map(
          (c, i) => (
            <button
              key={c}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                i === 0
                  ? "bg-foreground text-background"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {c}
            </button>
          )
        )}
      </div>

      {/* Card stack */}
      <div className="relative flex-1 px-5 pb-3 pt-2">
        <div className="relative h-full w-full">
          {index >= deck.length ? (
            <EmptyState onReset={reset} likedCount={liked.length} />
          ) : (
            visible.map((item, i) => {
              const stackIdx = visible.length - 1 - i; // 0 = top
              return (
                <SwipeCard
                  key={item.id}
                  item={item}
                  index={stackIdx}
                  isTop={stackIdx === 0}
                  onSwipe={handleSwipe}
                  onTap={() => setOpenArticle(item)}
                />
              );
            })
          )}

          {/* Full-card feedback flash */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                exit={{ opacity: 0 }}
                className={`pointer-events-none absolute inset-0 rounded-3xl ${
                  feedback === "right" ? "bg-[var(--color-like)]" : "bg-[var(--color-nope)]"
                }`}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Action buttons */}
      {index < deck.length && (
        <div className="z-10 flex shrink-0 items-center justify-center gap-6 px-5 pb-6 pt-2">
          <ActionButton
            onClick={() => handleSwipe("left")}
            color="nope"
            label="Skip"
          >
            <X className="h-7 w-7" strokeWidth={3} />
          </ActionButton>
          <ActionButton
            onClick={() => openArticle === null && setOpenArticle(deck[index])}
            color="brand"
            small
            label="Lesen"
          >
            <Search className="h-5 w-5" strokeWidth={2.5} />
          </ActionButton>
          <ActionButton
            onClick={() => handleSwipe("right")}
            color="like"
            label="Mehr"
          >
            <Heart className="h-7 w-7" strokeWidth={3} />
          </ActionButton>
        </div>
      )}

      {/* Hint */}
      <p className="z-10 shrink-0 pb-3 text-center text-[11px] text-muted-foreground">
        Swipe rechts für <span className="font-semibold text-[var(--color-like)]">mehr davon</span> • links für{" "}
        <span className="font-semibold text-[var(--color-nope)]">weniger</span> • Tippen zum Lesen
      </p>

      <ArticleSheet item={openArticle} onClose={() => setOpenArticle(null)} />
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  color,
  label,
  small,
}: {
  children: React.ReactNode;
  onClick: () => void;
  color: "nope" | "like" | "brand";
  label: string;
  small?: boolean;
}) {
  const colorClass =
    color === "nope"
      ? "text-[var(--color-nope)] border-[var(--color-nope)]/30"
      : color === "like"
        ? "text-[var(--color-like)] border-[var(--color-like)]/30"
        : "text-primary border-primary/30";
  const size = small ? "h-12 w-12" : "h-16 w-16";
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`${size} grid place-items-center rounded-full border-2 bg-card shadow-[0_8px_20px_-8px_rgba(0,0,0,0.25)] transition active:scale-90 ${colorClass}`}
    >
      {children}
    </button>
  );
}

function EmptyState({ onReset, likedCount }: { onReset: () => void; likedCount: number }) {
  return (
    <div className="grid h-full w-full place-items-center rounded-3xl border-2 border-dashed border-border bg-card p-6 text-center">
      <div>
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
          <Heart className="h-8 w-8" />
        </div>
        <h2 className="font-display text-2xl font-bold">Alles durchgeswipt!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Du hast {likedCount} {likedCount === 1 ? "Artikel" : "Artikel"} gemerkt.
          Wir lernen aus deinen Vorlieben.
        </p>
        <button
          onClick={onReset}
          className="mt-5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md"
        >
          Neue Runde starten
        </button>
      </div>
    </div>
  );
}
