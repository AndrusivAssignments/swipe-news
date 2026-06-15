import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Bookmark, Clock, Share2, Link, Send, Copy, CheckCircle2 } from "lucide-react";
import type { NewsItem } from "@/data/news";

interface Props {
  item: NewsItem | null;
  onClose: () => void;
}

type ShareMode = "whatsapp" | "link";

const SHARE_OPTIONS: {
  mode: ShareMode;
  label: string;
  icon: "whatsapp" | "link";
}[] = [
  { mode: "whatsapp", label: "WhatsApp", icon: "whatsapp" },
  { mode: "link", label: "Link", icon: "link" },
];

const sentColorClass = (mode: ShareMode) =>
  mode === "whatsapp" ? "bg-[#25D366]" : "bg-foreground";

export function ArticleSheet({ item, onClose }: Props) {
  const [shareOpen, setShareOpen] = useState(false);
  const [shareMode, setShareMode] = useState<ShareMode>("whatsapp");
  const [shareSent, setShareSent] = useState(false);

  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 z-40 bg-black/50"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="absolute inset-x-0 bottom-0 top-10 z-50 overflow-hidden rounded-t-3xl bg-background shadow-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="relative h-56 shrink-0 overflow-hidden">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-black/30" />
                <button
                  onClick={onClose}
                  aria-label="Schließen"
                  className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-background/90 text-foreground shadow-lg backdrop-blur"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute left-4 top-4">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-8 pt-4">
                <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {item.readTime}
                  </span>
                  <span>•</span>
                  <span>{item.publishedAt}</span>
                </div>
                <h1 className="font-display text-3xl font-bold leading-tight text-foreground">
                  {item.title}
                </h1>
                <p className="mt-4 text-base font-medium leading-relaxed text-foreground">
                  {item.summary}
                </p>
                <div className="my-4 h-px bg-border" />
                <p className="text-base leading-relaxed text-muted-foreground">{item.body}</p>
                <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                  Die Kurzfassung zeigt dir zuerst, warum die Meldung für Heilbronn und die Region
                  relevant ist. Wenn dich das Thema interessiert, kannst du den ganzen Artikel
                  lesen, speichern oder direkt als kompakte Karte teilen.
                </p>
              </div>

              <div className="flex shrink-0 items-center justify-around border-t border-border bg-card px-4 py-3">
                <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Bookmark className="h-5 w-5" /> Merken
                </button>
                <button
                  onClick={() => {
                    setShareOpen(true);
                    setShareSent(false);
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                >
                  <Share2 className="h-5 w-5" /> Teilen
                </button>
                <button
                  onClick={onClose}
                  className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-md"
                >
                  Weiter swipen
                </button>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {shareOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[60] grid place-items-center bg-black/65 p-5"
              >
                <motion.div
                  initial={{ scale: 0.95, y: 16 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 16 }}
                  transition={{ type: "spring", damping: 30, stiffness: 320 }}
                  className="w-full max-w-[350px]"
                >
                  <div className="mb-3 flex items-center justify-between text-white">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
                        Teilen
                      </p>
                      <h2 className="font-display text-xl font-bold leading-tight">
                        Karte generieren
                      </h2>
                    </div>
                    <button
                      onClick={() => setShareOpen(false)}
                      aria-label="Teilen-Vorschau schließen"
                      className="grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mb-3 grid grid-cols-2 gap-2">
                    {SHARE_OPTIONS.map((option) => {
                      const active = shareMode === option.mode;
                      return (
                        <button
                          key={option.mode}
                          onClick={() => {
                            setShareMode(option.mode);
                            setShareSent(false);
                          }}
                          className={`rounded-2xl px-3 py-2 text-left transition active:scale-[0.98] ${
                            active
                              ? option.mode === "whatsapp"
                                ? "bg-[#25D366] text-white shadow-lg shadow-black/10"
                                : "bg-white text-foreground shadow-lg shadow-black/10"
                              : "bg-white/12 text-white"
                          }`}
                        >
                          <span
                            className={`grid h-7 w-7 place-items-center rounded-full text-xs font-black ${
                              active
                                ? option.mode === "whatsapp"
                                  ? "bg-white/20"
                                  : "bg-primary/10 text-primary"
                                : "bg-white/10 text-white"
                            }`}
                          >
                            {option.icon === "whatsapp" && "W"}
                            {option.icon === "link" && <Link className="h-4 w-4" />}
                          </span>
                          <span className="mt-2 block text-xs font-bold">{option.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative grid h-[500px] place-items-center">
                    <AnimatePresence>
                      {shareSent && (
                        <motion.div
                          initial={{ opacity: 0, y: 18, scale: 0.92 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.96 }}
                          transition={{ type: "spring", damping: 18, stiffness: 340 }}
                          className={`absolute top-4 z-10 flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black text-white shadow-2xl shadow-black/25 ${sentColorClass(shareMode)}`}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {shareMode === "whatsapp" && "An WhatsApp gesendet"}
                          {shareMode === "link" && "Link kopiert"}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <motion.div
                      animate={
                        shareSent
                          ? { y: -14, scale: 0.96, opacity: 0.74 }
                          : { y: 0, scale: 1, opacity: 1 }
                      }
                      transition={{ type: "spring", damping: 20, stiffness: 260 }}
                    >
                      <SharePreview item={item} mode={shareMode} />
                    </motion.div>
                  </div>

                  <button
                    onClick={() => setShareSent(true)}
                    className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-white shadow-xl shadow-black/15 transition active:scale-[0.98] ${
                      shareSent
                        ? sentColorClass(shareMode)
                        : shareMode === "whatsapp"
                          ? "bg-[#25D366]"
                          : "bg-foreground"
                    }`}
                  >
                    {shareSent ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : shareMode === "link" ? (
                      <Copy className="h-4 w-4" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {shareSent && "Gesendet"}
                    {!shareSent && shareMode === "whatsapp" && "Karte in WhatsApp senden"}
                    {!shareSent && shareMode === "link" && "Link mit Karte kopieren"}
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

function SharePreview({ item, mode }: { item: NewsItem; mode: ShareMode }) {
  const shortTitle = item.title
    .replace("Neckaruferpromenade", "Neckarufer")
    .replace("öffnet im", "öffnet");

  if (mode === "link") {
    return (
      <div className="mx-auto w-[292px] overflow-hidden rounded-[1.35rem] bg-white shadow-2xl ring-1 ring-white/15">
        <div className="flex gap-3 p-3">
          <img src={item.image} alt="" className="h-[86px] w-[76px] rounded-2xl object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-primary px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.1em] text-white">
                {item.category}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground">{item.readTime}</span>
            </div>
            <h3 className="mt-1.5 line-clamp-2 break-words font-display text-[19px] font-bold leading-[0.98] text-foreground">
              {shortTitle}
            </h3>
            <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
              {item.summary}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border bg-[#f7f2ef] px-3 py-2">
          <p className="truncate text-[11px] font-bold text-foreground">stimme-swipe.de/story</p>
          <span className="rounded-full bg-foreground px-2.5 py-1 text-[10px] font-bold text-white">
            Kopieren
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-[278px] overflow-hidden rounded-[1.45rem] bg-[#fffaf5] shadow-2xl ring-1 ring-white/15">
      <div className="relative overflow-hidden bg-[#211919] px-4 pb-4 pt-3 text-white">
        <div className="absolute -right-10 -top-12 h-28 w-28 rounded-full bg-primary/55 blur-2xl" />
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/55">
              Heilbronner
            </p>
            <p className="font-display text-[22px] font-black leading-none">
              Stimme<span className="text-primary">·Swipe</span>
            </p>
          </div>
          <span className="rounded-full bg-white px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em] text-primary">
            WhatsApp
          </span>
        </div>

        <div className="relative mt-4">
          <img
            src={item.image}
            alt=""
            className="h-[118px] w-full rounded-2xl object-cover shadow-lg ring-1 ring-white/15"
          />
          <div className="mt-3 min-w-0">
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full bg-primary px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em]">
                {item.category}
              </span>
              <span className="rounded-full bg-white/14 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em]">
                60 Sek.
              </span>
            </div>
            <h3 className="mt-2 line-clamp-2 break-words font-display text-[27px] font-bold leading-[0.95]">
              {shortTitle}
            </h3>
          </div>
        </div>
      </div>

      <div className="space-y-3 bg-[#fffaf5] p-4">
        <div className="rounded-[1.15rem] border border-primary/20 bg-white px-3.5 py-3 shadow-[0_10px_24px_-18px_rgba(24,10,10,0.65)]">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
              Kurz gesagt
            </p>
          </div>
          <p className="line-clamp-3 text-[14px] font-bold leading-snug text-[#211919]">
            {item.summary}
          </p>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-[#f4eeee] px-3 py-2">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              Öffnen in
            </p>
            <p className="text-xs font-black text-foreground">stimme-swipe.de</p>
          </div>
          <span className="rounded-full bg-[#25D366] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm">
            Lesen
          </span>
        </div>
      </div>
    </div>
  );
}
