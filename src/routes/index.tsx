import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X, User, Search, Bookmark } from "lucide-react";
import { NEWS, type NewsItem, type Category } from "@/data/news";
import { SwipeCard } from "@/components/SwipeCard";
import { ArticleSheet } from "@/components/ArticleSheet";
import { SavedSheet } from "@/components/SavedSheet";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stimme Swipe — News, die zu dir passt" },
      {
        name: "description",
        content:
          "Swipe-basierter News-Reader der Heilbronner Stimme. In 60 Wörtern informiert — entscheide selbst, was dich interessiert.",
      },
    ],
  }),
  component: Index,
});

const CATEGORIES: { label: string; value: Category | "Für dich" }[] = [
  { label: "Für dich", value: "Für dich" },
  { label: "Lokal", value: "Lokal" },
  { label: "Sport", value: "Sport" },
  { label: "Politik", value: "Politik" },
  { label: "Kultur", value: "Kultur" },
  { label: "Wirtschaft", value: "Wirtschaft" },
  { label: "Panorama", value: "Panorama" },
];

function Index() {
  const [activeCat, setActiveCat] = useState<Category | "Für dich">("Für dich");
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<NewsItem[]>([]);
  const [openArticle, setOpenArticle] = useState<NewsItem | null>(null);
  const [savedOpen, setSavedOpen] = useState(false);
  const [feedback, setFeedback] = useState<"left" | "right" | null>(null);
  const [trigger, setTrigger] = useState<"left" | "right" | null>(null);

  const deck = useMemo(
    () =>
      activeCat === "Für dich"
        ? NEWS
        : NEWS.filter((n) => n.category === activeCat),
    [activeCat]
  );

  // Reset deck position when category changes
  useEffect(() => {
    setIndex(0);
    setTrigger(null);
  }, [activeCat]);

  const visible = deck.slice(index, index + 3).reverse();

  const completeSwipe = (dir: "left" | "right") => {
    setFeedback(dir);
    setTimeout(() => setFeedback(null), 300);
    if (dir === "right") {
      const item = deck[index];
      setLiked((l) => (l.find((x) => x.id === item.id) ? l : [item, ...l]));
    }
    setIndex((i) => i + 1);
    setTrigger(null);
  };

  const reset = () => setIndex(0);

  return (
    <div className="relative mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden bg-background">
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
        <button
          onClick={() => setSavedOpen(true)}
          className="relative grid h-10 w-10 place-items-center rounded-full bg-secondary text-secondary-foreground"
        >
          <Bookmark className="h-5 w-5" />
          {liked.length > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {liked.length}
            </span>
          )}
        </button>
      </header>

      <div className="z-10 flex shrink-0 gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((c) => {
          const active = c.value === activeCat;
          return (
            <button
              key={c.value}
              onClick={() => setActiveCat(c.value)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                active
                  ? "bg-foreground text-background"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="relative flex-1 px-5 pb-3 pt-2">
        <div className="relative h-full w-full">
          {index >= deck.length || deck.length === 0 ? (
            <EmptyState
              onReset={reset}
              likedCount={liked.length}
              hasItems={deck.length > 0}
              category={activeCat}
            />
          ) : (
            visible.map((item, i) => {
              const stackIdx = visible.length - 1 - i;
              return (
                <SwipeCard
                  key={`${activeCat}-${item.id}`}
                  item={item}
                  index={stackIdx}
                  isTop={stackIdx === 0}
                  onSwipe={completeSwipe}
                  onTap={() => setOpenArticle(item)}
                  triggerSwipe={stackIdx === 0 ? trigger : null}
                />
              );
            })
          )}

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

      {index < deck.length && deck.length > 0 && (
        <div className="z-10 flex shrink-0 items-center justify-center gap-6 px-5 pb-6 pt-2">
          <ActionButton
            onClick={() => !trigger && setTrigger("left")}
            color="nope"
            label="Skip"
          >
            <X className="h-7 w-7" strokeWidth={3} />
          </ActionButton>
          <ActionButton
            onClick={() => setOpenArticle(deck[index])}
            color="brand"
            small
            label="Lesen"
          >
            <Search className="h-5 w-5" strokeWidth={2.5} />
          </ActionButton>
          <ActionButton
            onClick={() => !trigger && setTrigger("right")}
            color="like"
            label="Mehr"
          >
            <Heart className="h-7 w-7" strokeWidth={3} />
          </ActionButton>
        </div>
      )}

      <p className="z-10 shrink-0 pb-3 text-center text-[11px] text-muted-foreground">
        Swipe rechts für{" "}
        <span className="font-semibold text-[var(--color-like)]">mehr davon</span> •
        links für <span className="font-semibold text-[var(--color-nope)]">weniger</span>{" "}
        • Tippen zum Lesen
      </p>

      <ArticleSheet item={openArticle} onClose={() => setOpenArticle(null)} />
      <SavedSheet
        open={savedOpen}
        items={liked}
        onClose={() => setSavedOpen(false)}
        onOpenArticle={(it) => {
          setSavedOpen(false);
          setTimeout(() => setOpenArticle(it), 200);
        }}
        onRemove={(id) => setLiked((l) => l.filter((x) => x.id !== id))}
      />
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

function EmptyState({
  onReset,
  likedCount,
  hasItems,
  category,
}: {
  onReset: () => void;
  likedCount: number;
  hasItems: boolean;
  category: string;
}) {
  return (
    <div className="grid h-full w-full place-items-center rounded-3xl border-2 border-dashed border-border bg-card p-6 text-center">
      <div>
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
          <Heart className="h-8 w-8" />
        </div>
        <h2 className="font-display text-2xl font-bold">
          {hasItems ? "Alles durchgeswipt!" : `Keine ${category}-News`}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {hasItems
            ? `Du hast ${likedCount} ${
                likedCount === 1 ? "Artikel" : "Artikel"
              } gemerkt. Wir lernen aus deinen Vorlieben.`
            : "Wechsel die Kategorie oder schau später noch mal vorbei."}
        </p>
        {hasItems && (
          <button
            onClick={onReset}
            className="mt-5 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md"
          >
            Neue Runde starten
          </button>
        )}
      </div>
    </div>
  );
}
