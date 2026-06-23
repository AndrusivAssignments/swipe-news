import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  X,
  User,
  Search,
  Bookmark,
  Home,
  Sparkles,
  Compass,
  Settings,
  Clock,
  Flame,
  MapPin,
  Check,
  ChevronRight,
  SlidersHorizontal,
  BookOpen,
} from "lucide-react";
import { NEWS, type NewsItem, type Category } from "@/data/news";
import { SwipeCard } from "@/components/SwipeCard";
import { ArticleSheet } from "@/components/ArticleSheet";
import { SavedSheet } from "@/components/SavedSheet";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stimme Swipe - News, die zu dir passt" },
      {
        name: "description",
        content:
          "Swipe-basierter News-Reader der Heilbronner Stimme. In 60 Wörtern informiert und auf junge Leser zugeschnitten.",
      },
    ],
  }),
  component: Index,
});

type Tab = "swipe" | "today" | "explore" | "saved" | "profile";
type SwipeMode = "Für dich" | "Entdecken";

const TODAY_FILTERS: { label: string; value: Category | "Für dich" }[] = [
  { label: "Für dich", value: "Für dich" },
  { label: "Lokal", value: "Lokal" },
  { label: "Sport", value: "Sport" },
  { label: "Politik", value: "Politik" },
  { label: "Kultur", value: "Kultur" },
  { label: "Wirtschaft", value: "Wirtschaft" },
  { label: "Panorama", value: "Panorama" },
];

const SWIPE_MODES: { label: string; value: SwipeMode; helper: string }[] = [
  {
    label: "Für dich",
    value: "Für dich",
    helper: "Basierend auf deinen bisherigen Swipes.",
  },
  {
    label: "Entdecken",
    value: "Entdecken",
    helper: "Überraschende Themen außerhalb deiner Routine.",
  },
];

const INTERESTS = [
  "Events",
  "Campus",
  "Sport",
  "Mobilität",
  "Jobs",
  "Kultur",
  "Politik kurz erklärt",
  "Wochenendtipps",
];

const TOPICS: Record<Category, string[]> = {
  Lokal: ["Innenstadt", "Verkehr", "Stadtleben"],
  Sport: ["Falken", "Marathon", "Vereine"],
  Politik: ["Gemeinderat", "Schule", "Klima"],
  Kultur: ["Konzerte", "Museen", "Festivals"],
  Wirtschaft: ["Ausbildung", "Audi", "Startups"],
  Panorama: ["Menschen", "Social Media", "Alltag"],
};

function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("swipe");
  const [activeCat, setActiveCat] = useState<SwipeMode>("Für dich");
  const [todayCat, setTodayCat] = useState<Category | "Für dich">("Für dich");
  const [index, setIndex] = useState(0);
  const [liked, setLiked] = useState<NewsItem[]>([]);
  const [skipped, setSkipped] = useState<NewsItem[]>([]);
  const [swipedIds, setSwipedIds] = useState<string[]>([]);
  const [openArticle, setOpenArticle] = useState<NewsItem | null>(null);
  const [savedOpen, setSavedOpen] = useState(false);
  const [feedback, setFeedback] = useState<"left" | "right" | null>(null);
  const [trigger, setTrigger] = useState<"left" | "right" | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1600);
    return () => clearTimeout(timer);
  }, []);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Events",
    "Campus",
    "Wochenendtipps",
  ]);

  const seenIds = useMemo(() => {
    return new Set(swipedIds);
  }, [swipedIds]);

  const deck = useMemo(() => {
    const unseen = NEWS.filter((item) => !seenIds.has(item.id));

    if (activeCat === "Entdecken") {
      return [...unseen].sort((a, b) => b.id.localeCompare(a.id));
    }

    return unseen;
  }, [activeCat, seenIds]);

  const categorySignals = useMemo(() => {
    const counts = new Map<Category, { likes: number; skips: number }>();
    NEWS.forEach((item) => counts.set(item.category, { likes: 0, skips: 0 }));
    liked.forEach((item) => {
      const current = counts.get(item.category);
      if (current) current.likes += 1;
    });
    skipped.forEach((item) => {
      const current = counts.get(item.category);
      if (current) current.skips += 1;
    });
    return counts;
  }, [liked, skipped]);

  const favoriteCategory = useMemo(() => {
    const ranked = [...categorySignals.entries()].sort(
      (a, b) => b[1].likes - b[1].skips - (a[1].likes - a[1].skips),
    );
    return ranked[0]?.[1].likes ? ranked[0][0] : "Lokal";
  }, [categorySignals]);

  const todayFeed = useMemo(() => {
    const source =
      todayCat === "Für dich" ? NEWS : NEWS.filter((item) => item.category === todayCat);
    return [...source].sort((a, b) => {
      const aSignal = categorySignals.get(a.category);
      const bSignal = categorySignals.get(b.category);
      const aScore = (aSignal?.likes ?? 0) - (aSignal?.skips ?? 0);
      const bScore = (bSignal?.likes ?? 0) - (bSignal?.skips ?? 0);
      return bScore - aScore;
    });
  }, [categorySignals, todayCat]);

  useEffect(() => {
    setIndex(0);
    setTrigger(null);
  }, [activeCat]);

  const visible = deck.slice(0, 3).reverse();

  const completeSwipe = (dir: "left" | "right") => {
    const item = deck[0];
    if (!item) return;

    setFeedback(dir);
    setTimeout(() => setFeedback(null), 300);
    setSwipedIds((ids) => (ids.includes(item.id) ? ids : [...ids, item.id]));

    if (dir === "right") {
      setLiked((items) =>
        items.find((existing) => existing.id === item.id) ? items : [item, ...items],
      );
    } else {
      setSkipped((items) =>
        items.find((existing) => existing.id === item.id) ? items : [item, ...items],
      );
    }

    setIndex(0);
    setTrigger(null);
  };

  const reset = () => {
    setIndex(0);
    setSwipedIds([]);
    setSkipped([]);
  };

  return (
    <div className="min-h-[100dvh] bg-secondary px-0 text-foreground sm:grid sm:place-items-center sm:p-6">
      <div className="relative mx-auto flex h-[100dvh] w-full max-w-md flex-col overflow-hidden bg-background shadow-[0_24px_80px_-40px_rgba(0,0,0,0.45)] sm:h-[860px] sm:max-h-[calc(100dvh-48px)] sm:rounded-[2rem]">
        <AppHeader
          activeTab={activeTab}
          favoriteCategory={favoriteCategory}
          likedCount={liked.length}
          onProfileOpen={() => setActiveTab("profile")}
          onSavedOpen={() => setSavedOpen(true)}
        />

        <main className="min-h-0 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === "swipe" && (
              <SwipeView
                key="swipe"
                activeCat={activeCat}
                deck={deck}
                feedback={feedback}
                index={index}
                likedCount={liked.length}
                setActiveCat={setActiveCat}
                setOpenArticle={setOpenArticle}
                setTrigger={setTrigger}
                trigger={trigger}
                totalCount={NEWS.length}
                visible={visible}
                onReset={reset}
                onSwipe={completeSwipe}
              />
            )}
            {activeTab === "today" && (
              <TodayView
                key="today"
                feed={todayFeed}
                favoriteCategory={favoriteCategory}
                liked={liked}
                selectedCategory={todayCat}
                onCategoryChange={setTodayCat}
                onGoSwipe={() => setActiveTab("swipe")}
                onShowAll={() => setTodayCat("Für dich")}
                onOpenArticle={setOpenArticle}
              />
            )}
            {activeTab === "explore" && (
              <ExploreView
                key="explore"
                favoriteCategory={favoriteCategory}
                onCategorySelect={(category) => {
                  setTodayCat(category);
                  setActiveTab("today");
                }}
              />
            )}
            {activeTab === "saved" && (
              <SavedView
                key="saved"
                items={liked}
                onOpenArticle={setOpenArticle}
                onRemove={(id) => setLiked((items) => items.filter((item) => item.id !== id))}
              />
            )}
            {activeTab === "profile" && (
              <ProfileView
                key="profile"
                favoriteCategory={favoriteCategory}
                liked={liked}
                skipped={skipped}
                selectedInterests={selectedInterests}
                setSelectedInterests={setSelectedInterests}
              />
            )}
          </AnimatePresence>
        </main>

        <BottomNav activeTab={activeTab} onChange={setActiveTab} savedCount={liked.length} />

        <Onboarding
          open={showOnboarding}
          selectedInterests={selectedInterests}
          setSelectedInterests={setSelectedInterests}
          onClose={() => setShowOnboarding(false)}
        />

        <Splash show={showSplash} />

        <ArticleSheet item={openArticle} onClose={() => setOpenArticle(null)} />
        <SavedSheet
          open={savedOpen}
          items={liked}
          onClose={() => setSavedOpen(false)}
          onOpenArticle={(item) => {
            setSavedOpen(false);
            setTimeout(() => setOpenArticle(item), 200);
          }}
          onRemove={(id) => setLiked((items) => items.filter((item) => item.id !== id))}
        />
      </div>
    </div>
  );
}

function AppHeader({
  activeTab,
  favoriteCategory,
  likedCount,
  onProfileOpen,
  onSavedOpen,
}: {
  activeTab: Tab;
  favoriteCategory: Category;
  likedCount: number;
  onProfileOpen: () => void;
  onSavedOpen: () => void;
}) {
  const title =
    activeTab === "swipe"
      ? "Stimme Swipe"
      : activeTab === "today"
        ? "Heute"
        : activeTab === "explore"
          ? "Entdecken"
          : activeTab === "saved"
            ? "Meine Liste"
            : "Mein Profil";

  return (
    <header className="z-20 shrink-0 border-b border-border/60 bg-background/95 px-5 pb-3 pt-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <button
          onClick={onProfileOpen}
          aria-label="Profil öffnen"
          className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-secondary-foreground transition active:scale-95"
        >
          <User className="h-5 w-5" />
        </button>
        <div className="flex flex-col items-center leading-none">
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Heilbronner
          </span>
          <span className="font-display text-2xl font-black text-primary">
            Stimme<span className="text-foreground">·{title.replace("Stimme ", "")}</span>
          </span>
        </div>
        <button
          onClick={onSavedOpen}
          className="relative grid h-10 w-10 place-items-center rounded-full bg-secondary text-secondary-foreground"
        >
          <Bookmark className="h-5 w-5" />
          {likedCount > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {likedCount}
            </span>
          )}
        </button>
      </div>
      {activeTab !== "swipe" && (
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Dein Feed lernt gerade besonders: {favoriteCategory}
        </div>
      )}
    </header>
  );
}

function SwipeView({
  activeCat,
  deck,
  feedback,
  index,
  likedCount,
  setActiveCat,
  setOpenArticle,
  setTrigger,
  trigger,
  totalCount,
  visible,
  onReset,
  onSwipe,
}: {
  activeCat: SwipeMode;
  deck: NewsItem[];
  feedback: "left" | "right" | null;
  index: number;
  likedCount: number;
  setActiveCat: (mode: SwipeMode) => void;
  setOpenArticle: (item: NewsItem) => void;
  setTrigger: (dir: "left" | "right" | null) => void;
  trigger: "left" | "right" | null;
  totalCount: number;
  visible: NewsItem[];
  onReset: () => void;
  onSwipe: (dir: "left" | "right") => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      className="flex h-full flex-col overflow-hidden"
    >
      <div className="z-10 shrink-0 px-5 pb-2 pt-3">
        <div className="grid grid-cols-2 gap-1.5 rounded-full bg-secondary p-1">
          {SWIPE_MODES.map((mode) => {
            const active = mode.value === activeCat;
            const Icon = mode.value === "Für dich" ? Sparkles : Compass;
            return (
              <button
                key={mode.value}
                onClick={() => setActiveCat(mode.value)}
                aria-label={`${mode.label}: ${mode.helper}`}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-black transition active:scale-[0.98] ${
                  active
                    ? "bg-primary text-primary-foreground shadow-[0_10px_22px_-12px_rgba(0,125,197,0.75)]"
                    : "bg-card text-foreground shadow-sm ring-1 ring-border"
                }`}
              >
                <Icon className="h-4 w-4" />
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative flex-1 px-5 pb-2 pt-0">
        <div className="relative h-full w-full">
          {index >= deck.length || deck.length === 0 ? (
            <EmptyState
              onReset={onReset}
              likedCount={likedCount}
              hasItems={totalCount > 0}
              category={activeCat}
            />
          ) : (
            visible.map((item, itemIndex) => {
              const stackIdx = visible.length - 1 - itemIndex;
              return (
                <SwipeCard
                  key={`${activeCat}-${item.id}`}
                  item={item}
                  index={stackIdx}
                  isTop={stackIdx === 0}
                  onSwipe={onSwipe}
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
        <div className="z-10 shrink-0 px-5 pb-3 pt-2">
          <div className="mx-auto flex max-w-[310px] items-center justify-between rounded-[1.6rem] bg-card/92 px-3 py-2 shadow-[0_16px_34px_-22px_rgba(0,40,70,0.55)] ring-1 ring-border/80 backdrop-blur">
            <ActionButton
              onClick={() => !trigger && setTrigger("left")}
              color="nope"
              label="Weniger"
            >
              <X className="h-5 w-5" strokeWidth={2.7} />
            </ActionButton>
            <ActionButton
              onClick={() => setOpenArticle(deck[index])}
              color="brand"
              featured
              label="Lesen"
            >
              <Search className="h-4 w-4" strokeWidth={2.5} />
            </ActionButton>
            <ActionButton onClick={() => !trigger && setTrigger("right")} color="like" label="Mehr">
              <Heart className="h-5 w-5" strokeWidth={2.7} />
            </ActionButton>
          </div>
        </div>
      )}

      <p className="z-10 shrink-0 px-5 pb-3 text-center text-[10px] font-medium text-muted-foreground">
        Swipe rechts für mehr davon, links für weniger. Tippen öffnet den Artikel.
      </p>
    </motion.section>
  );
}

function TodayView({
  feed,
  favoriteCategory,
  liked,
  selectedCategory,
  onCategoryChange,
  onGoSwipe,
  onShowAll,
  onOpenArticle,
}: {
  feed: NewsItem[];
  favoriteCategory: Category;
  liked: NewsItem[];
  selectedCategory: Category | "Für dich";
  onCategoryChange: (category: Category | "Für dich") => void;
  onGoSwipe: () => void;
  onShowAll: () => void;
  onOpenArticle: (item: NewsItem) => void;
}) {
  const lead = feed[0];
  const likedIds = new Set(liked.map((item) => item.id));

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      className="h-full overflow-y-auto scroll-smooth px-5 pt-0 [scroll-snap-type:y_mandatory]"
    >
      <div className="flex flex-col gap-4 pb-6">
        <TodayFilterBar selectedCategory={selectedCategory} onCategoryChange={onCategoryChange} />
        {selectedCategory !== "Für dich" && (
          <TopicIntroCard category={selectedCategory} count={feed.length} onShowAll={onShowAll} />
        )}
        {feed.map((item, itemIndex) => (
          <TodayStory
            key={item.id}
            item={item}
            isLead={item.id === lead.id}
            isSaved={likedIds.has(item.id)}
            isPersonalized={item.category === favoriteCategory}
            position={itemIndex + 1}
            total={feed.length}
            favoriteCategory={favoriteCategory}
            likedCount={liked.length}
            onClick={() => onOpenArticle(item)}
          />
        ))}
        <TodayCompleteCard
          favoriteCategory={favoriteCategory}
          likedCount={liked.length}
          total={feed.length}
          onGoSwipe={onGoSwipe}
        />
      </div>
    </motion.section>
  );
}

function TodayFilterBar({
  selectedCategory,
  onCategoryChange,
}: {
  selectedCategory: Category | "Für dich";
  onCategoryChange: (category: Category | "Für dich") => void;
}) {
  return (
    <div className="sticky top-0 z-20 -mx-5 border-b border-primary/10 bg-[#eef7fd] px-5 py-3 shadow-[0_10px_24px_-24px_rgba(0,60,100,0.45)] [scroll-snap-align:start]">
      <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TODAY_FILTERS.map((category) => {
          const active = category.value === selectedCategory;
          return (
            <button
              key={category.value}
              onClick={() => onCategoryChange(category.value)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition active:scale-95 ${
                active ? "bg-foreground text-background" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TopicIntroCard({
  category,
  count,
  onShowAll,
}: {
  category: Category;
  count: number;
  onShowAll: () => void;
}) {
  return (
    <section className="scroll-mt-4 rounded-3xl border border-primary/15 bg-primary/5 p-5 [scroll-snap-align:start]">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
          <Compass className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
            Suche geöffnet
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold leading-tight">
            {category} im Scroll
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {count} Meldungen. Scrolle nach unten, um eine Story nach der anderen zu lesen.
          </p>
          <button
            onClick={onShowAll}
            className="mt-3 rounded-full bg-card px-4 py-2 text-xs font-bold text-primary shadow-sm transition active:scale-95"
          >
            Alle Themen zeigen
          </button>
        </div>
      </div>
    </section>
  );
}

function TodayCompleteCard({
  favoriteCategory,
  likedCount,
  total,
  onGoSwipe,
}: {
  favoriteCategory: Category;
  likedCount: number;
  total: number;
  onGoSwipe: () => void;
}) {
  return (
    <section className="grid min-h-[calc(100dvh-235px)] scroll-mt-4 place-items-center rounded-3xl border border-primary/15 bg-card p-6 text-center shadow-[0_18px_50px_-28px_rgba(0,0,0,0.38)] [scroll-snap-align:start] sm:min-h-[610px]">
      <div>
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="h-8 w-8" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Heute abgeschlossen
        </p>
        <h2 className="mt-2 font-display text-4xl font-bold leading-tight">
          Du bist auf dem neuesten Stand.
        </h2>
        <p className="mx-auto mt-3 max-w-[28ch] text-sm leading-relaxed text-muted-foreground">
          {total} Meldungen gelesen. Swipe weiter, damit dein Feed bei {favoriteCategory} noch
          besser wird.
        </p>
        <div className="mt-5 rounded-2xl bg-secondary p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Heute gelernt
          </p>
          <p className="mt-1 text-sm font-bold text-foreground">
            {likedCount} persönliche Signale für deinen nächsten Feed
          </p>
        </div>
        <button
          onClick={onGoSwipe}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-md transition active:scale-[0.98]"
        >
          Weiter swipen
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

function TodayStory({
  item,
  isLead,
  isSaved,
  isPersonalized,
  position,
  total,
  favoriteCategory,
  likedCount,
  onClick,
}: {
  item: NewsItem;
  isLead: boolean;
  isSaved: boolean;
  isPersonalized: boolean;
  position: number;
  total: number;
  favoriteCategory: Category;
  likedCount: number;
  onClick: () => void;
}) {
  const whyItMatters =
    item.category === "Lokal"
      ? "Direkt relevant für Wege, Treffpunkte und Alltag in Heilbronn."
      : item.category === "Kultur"
        ? "Gut für Wochenendplanung, Freundeskreis und lokale Szenen."
        : item.category === "Sport"
          ? "Schneller Überblick über Teams und Events aus der Region."
          : item.category === "Politik"
            ? "Kurz erklärt, was Entscheidungen konkret für junge Menschen ändern."
            : item.category === "Wirtschaft"
              ? "Wichtig für Jobs, Ausbildung und die Zukunft der Region."
              : "Eine lokale Geschichte, die gerade Gesprächsstoff liefert.";

  return (
    <article className="flex min-h-[calc(100dvh-235px)] scroll-mt-4 flex-col overflow-hidden rounded-3xl bg-card shadow-[0_18px_50px_-28px_rgba(0,0,0,0.38)] [scroll-snap-align:start] sm:min-h-[610px]">
      <button onClick={onClick} className="group flex flex-1 flex-col text-left">
        <div className="relative h-[38%] min-h-52 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            onError={(event) => {
              event.currentTarget.src = `https://picsum.photos/seed/${item.id}/900/650`;
            }}
            className="h-full w-full object-cover transition duration-500 group-active:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/10" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg">
              {isLead ? "Wichtig heute" : item.category}
            </span>
            {isPersonalized && (
              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary shadow-lg backdrop-blur">
                Für dich
              </span>
            )}
          </div>
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black/45 px-3 py-1 text-xs text-white backdrop-blur-sm">
            <Clock className="h-3.5 w-3.5" />
            {item.readTime}
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4 text-white">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/75">
                Heute {position}/{total}
              </p>
              <p className="mt-1 text-xs font-semibold text-white/80">
                Veröffentlicht: {item.publishedAt}
              </p>
              <h2 className="mt-1 font-display text-3xl font-bold leading-tight">{item.title}</h2>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="line-clamp-3 text-[15px] leading-relaxed text-foreground">{item.summary}</p>

          <div className="mt-3 rounded-2xl bg-secondary p-3">
            <div className="flex items-start gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Warum das zählt</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{whyItMatters}</p>
              </div>
            </div>
          </div>

          {isLead && (
            <div className="mt-3 rounded-2xl border border-primary/15 bg-primary/5 px-3 py-2.5">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Swipe wirkt hier mit</h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    Redaktionell wichtige Stories bleiben drin. {favoriteCategory} rückt für dich
                    höher.
                  </p>
                  <p className="mt-2 text-[11px] font-semibold text-primary">
                    {likedCount} Signale gesammelt
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="text-xs font-semibold text-muted-foreground">
              Nach unten für die nächste Story
            </span>
            <span className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-md">
              Lesen
              <ChevronRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </button>
      <div className="flex shrink-0 items-center justify-between border-t border-border bg-background/80 px-4 py-3">
        <button className="flex items-center gap-2 rounded-full bg-secondary px-3 py-2 text-xs font-semibold text-muted-foreground">
          <Bookmark className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : ""}`} />
          {isSaved ? "Gemerkt" : "Merken"}
        </button>
        <button
          onClick={onClick}
          className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
        >
          Voll lesen
        </button>
      </div>
    </article>
  );
}

function ExploreView({
  favoriteCategory,
  onCategorySelect,
}: {
  favoriteCategory: Category;
  onCategorySelect: (category: Category) => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      className="h-full overflow-y-auto px-5 pb-6 pt-4"
    >
      <div className="rounded-3xl bg-card p-5 shadow-sm">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
          Themenradar
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight">
          Finde deinen Einstieg in Heilbronn.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Wähle ein Thema und lies die passenden Meldungen im Heute-Scroll.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {TODAY_FILTERS.filter((category) => category.value !== "Für dich").map((category) => {
          const value = category.value as Category;
          return (
            <button
              key={value}
              onClick={() => onCategorySelect(value)}
              className="min-h-32 rounded-3xl bg-card p-4 text-left shadow-sm transition active:scale-[0.98]"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-primary">
                  {value === favoriteCategory ? (
                    <Flame className="h-5 w-5" />
                  ) : (
                    <Compass className="h-5 w-5" />
                  )}
                </span>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold">{category.label}</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {TOPICS[value].join(", ")}
              </p>
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}

function SavedView({
  items,
  onOpenArticle,
  onRemove,
}: {
  items: NewsItem[];
  onOpenArticle: (item: NewsItem) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      className="h-full overflow-y-auto px-5 pb-6 pt-4"
    >
      {items.length === 0 ? (
        <div className="grid h-full place-items-center rounded-3xl border-2 border-dashed border-border bg-card p-8 text-center">
          <div>
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-secondary text-muted-foreground">
              <BookOpen className="h-6 w-6" />
            </div>
            <h1 className="font-display text-2xl font-bold">Noch keine Liste</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Swipe rechts, um Stories für später zu merken.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="rounded-3xl bg-card p-5 shadow-sm">
            <h1 className="font-display text-2xl font-bold">Dein Abend-Briefing</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Aus deinen gespeicherten Artikeln könnte die App später ein kurzes persönliches Update
              bauen.
            </p>
          </div>
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 rounded-2xl bg-card p-3 shadow-sm">
              <button onClick={() => onOpenArticle(item)} className="flex flex-1 gap-3 text-left">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-24 w-24 shrink-0 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                    {item.category}
                  </span>
                  <h2 className="mt-1 line-clamp-2 text-sm font-bold leading-snug">{item.title}</h2>
                  <p className="mt-1 text-[11px] text-muted-foreground">{item.readTime}</p>
                </div>
              </button>
              <button
                onClick={() => onRemove(item.id)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-muted-foreground"
                aria-label="Entfernen"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  );
}

function ProfileView({
  favoriteCategory,
  liked,
  skipped,
  selectedInterests,
  setSelectedInterests,
}: {
  favoriteCategory: Category;
  liked: NewsItem[];
  skipped: NewsItem[];
  selectedInterests: string[];
  setSelectedInterests: (items: string[]) => void;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      className="h-full overflow-y-auto px-5 pb-6 pt-4"
    >
      <div className="rounded-3xl bg-card p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground">
            <User className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">Dein Newsprofil</h1>
            <p className="text-sm text-muted-foreground">Aktuell stärker: {favoriteCategory}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <ProfileMetric label="Mehr" value={liked.length} />
          <ProfileMetric label="Weniger" value={skipped.length} />
          <ProfileMetric label="Interessen" value={selectedInterests.length} />
        </div>
      </div>

      <div className="mt-4 rounded-3xl bg-card p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Interessen</h2>
          <SlidersHorizontal className="h-4 w-4 text-primary" />
        </div>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => {
            const selected = selectedInterests.includes(interest);
            return (
              <button
                key={interest}
                onClick={() =>
                  setSelectedInterests(
                    selected
                      ? selectedInterests.filter((item) => item !== interest)
                      : [...selectedInterests, interest],
                  )
                }
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
                  selected
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-3xl bg-card p-5 shadow-sm">
        <h2 className="font-display text-xl font-bold">Warum das wichtig ist</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Der Nutzer kann steuern, was die App lernt. Das macht Personalisierung transparenter und
          passt besser zu einer lokalen Zeitung.
        </p>
      </div>
    </motion.section>
  );
}

function ProfileMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-secondary p-3 text-center">
      <p className="font-display text-2xl font-bold text-primary">{value}</p>
      <p className="text-[11px] text-muted-foreground">{label}</p>
    </div>
  );
}

function Splash({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden bg-[#F5FAFE] text-[#111827]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="pointer-events-none absolute -top-24 -right-20 h-80 w-80 rounded-full bg-[#C8E9FF] blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.85, scale: 1 }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.05 }}
            className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-[#D4E8FF] blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.6, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
            className="pointer-events-none absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#E5F4FF] blur-3xl"
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.05 }}
              className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-[0_18px_40px_-18px_rgba(20,24,40,0.35)] ring-1 ring-black/5"
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>

            <span className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[#111827]/55">
              Heilbronner
            </span>
            <motion.h1
              initial={{ opacity: 0, letterSpacing: "0.04em" }}
              animate={{ opacity: 1, letterSpacing: "-0.02em" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-1 font-display text-[3.5rem] font-black leading-none"
            >
              Stimme
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-3 flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 shadow-sm ring-1 ring-black/5 backdrop-blur"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-[11px] font-bold tracking-[0.3em] text-[#111827]/80">
                SWIPE
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Onboarding({
  open,
  selectedInterests,
  setSelectedInterests,
  onClose,
}: {
  open: boolean;
  selectedInterests: string[];
  setSelectedInterests: (items: string[]) => void;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 grid place-items-center bg-black/55 p-4"
        >
          <motion.div
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="max-h-[calc(100dvh-2rem)] w-full overflow-y-auto rounded-[2rem] bg-background p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-start gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold leading-tight">
                  Dein Heilbronn in 60 Sekunden.
                </h1>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Wähle ein paar Interessen. Danach lernt Swipe mit jeder Karte weiter.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => {
                const selected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() =>
                      setSelectedInterests(
                        selected
                          ? selectedInterests.filter((item) => item !== interest)
                          : [...selectedInterests, interest],
                      )
                    }
                    className={`flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold transition active:scale-95 ${
                      selected
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {selected && <Check className="h-3.5 w-3.5" />}
                    {interest}
                  </button>
                );
              })}
            </div>
            <button
              onClick={onClose}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-md transition active:scale-[0.98]"
            >
              Start swipen
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BottomNav({
  activeTab,
  onChange,
  savedCount,
}: {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
  savedCount: number;
}) {
  const items: { tab: Tab; label: string; icon: ReactNode }[] = [
    { tab: "swipe", label: "Swipe", icon: <Sparkles className="h-5 w-5" /> },
    { tab: "today", label: "Heute", icon: <Home className="h-5 w-5" /> },
    { tab: "explore", label: "Suche", icon: <Compass className="h-5 w-5" /> },
    { tab: "saved", label: "Liste", icon: <Bookmark className="h-5 w-5" /> },
    { tab: "profile", label: "Profil", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <nav className="z-20 shrink-0 border-t border-border bg-card px-2 pb-3 pt-2">
      <div className="grid grid-cols-5 gap-1">
        {items.map((item) => {
          const active = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => onChange(item.tab)}
              className={`relative flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-semibold transition active:scale-95 ${
                active ? "bg-primary/10 text-primary" : "text-muted-foreground"
              }`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
              {item.tab === "saved" && savedCount > 0 && (
                <span className="absolute right-3 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                  {savedCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function ActionButton({
  children,
  onClick,
  color,
  label,
  featured,
}: {
  children: ReactNode;
  onClick: () => void;
  color: "nope" | "like" | "brand";
  label: string;
  featured?: boolean;
}) {
  const toneClass =
    color === "nope"
      ? "text-[var(--color-nope)] bg-[color-mix(in_oklab,var(--color-nope)_10%,white)] ring-[var(--color-nope)]/18"
      : color === "like"
        ? "text-[var(--color-like)] bg-[color-mix(in_oklab,var(--color-like)_10%,white)] ring-[var(--color-like)]/18"
        : "bg-primary text-primary-foreground ring-primary/20";

  if (featured) {
    return (
      <button
        onClick={onClick}
        aria-label={label}
        className={`flex h-11 min-w-[112px] items-center justify-center gap-2 rounded-full px-4 text-sm font-black shadow-[0_12px_24px_-16px_rgba(0,70,110,0.75)] ring-1 transition active:scale-[0.96] ${toneClass}`}
      >
        {children}
        <span>{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex h-11 min-w-[78px] flex-col items-center justify-center gap-0.5 rounded-2xl text-[10px] font-black shadow-[0_10px_22px_-18px_rgba(0,0,0,0.45)] ring-1 transition active:scale-[0.94] ${toneClass}`}
    >
      {children}
      <span className="leading-none">{label}</span>
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
