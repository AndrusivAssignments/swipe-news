import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Trash2 } from "lucide-react";
import type { NewsItem } from "@/data/news";

interface Props {
  open: boolean;
  items: NewsItem[];
  onClose: () => void;
  onOpenArticle: (item: NewsItem) => void;
  onRemove: (id: string) => void;
}

export function SavedSheet({ open, items, onClose, onOpenArticle, onRemove }: Props) {
  return (
    <AnimatePresence>
      {open && (
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
            className="absolute inset-x-0 bottom-0 top-10 z-50 flex flex-col overflow-hidden rounded-t-3xl bg-background shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="font-display text-xl font-bold">Meine Liste</h2>
                <p className="text-xs text-muted-foreground">
                  {items.length} {items.length === 1 ? "Artikel" : "Artikel"} gespeichert
                </p>
              </div>
              <button
                onClick={onClose}
                aria-label="Schließen"
                className="grid h-10 w-10 place-items-center rounded-full bg-secondary text-secondary-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3">
              {items.length === 0 ? (
                <div className="grid h-full w-full place-items-center p-8 text-center">
                  <div>
                    <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-secondary text-muted-foreground">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Noch nichts gespeichert. Swipe nach rechts, um Artikel
                      hierher zu legen.
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {items.map((it) => (
                    <li
                      key={it.id}
                      className="flex gap-3 overflow-hidden rounded-2xl bg-card shadow-sm"
                    >
                      <button
                        onClick={() => onOpenArticle(it)}
                        className="flex flex-1 gap-3 text-left"
                      >
                        <img
                          src={it.image}
                          alt={it.title}
                          className="h-24 w-24 shrink-0 object-cover"
                        />
                        <div className="flex min-w-0 flex-col py-2 pr-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                            {it.category}
                          </span>
                          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                            {it.title}
                          </h3>
                          <span className="mt-auto text-[11px] text-muted-foreground">
                            {it.readTime} · {it.publishedAt}
                          </span>
                        </div>
                      </button>
                      <button
                        onClick={() => onRemove(it.id)}
                        aria-label="Entfernen"
                        className="grid w-12 shrink-0 place-items-center text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
