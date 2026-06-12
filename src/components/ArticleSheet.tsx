import { motion, AnimatePresence } from "framer-motion";
import { X, Bookmark, Share2, Clock } from "lucide-react";
import type { NewsItem } from "@/data/news";

interface Props {
  item: NewsItem | null;
  onClose: () => void;
}

export function ArticleSheet({ item, onClose }: Props) {
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Heilbronner Stimme bietet
                  Ihnen jeden Tag die wichtigsten Nachrichten aus der Region - kompakt, schnell und
                  genau auf Ihre Interessen zugeschnitten.
                </p>
              </div>

              <div className="flex shrink-0 items-center justify-around border-t border-border bg-card px-4 py-3">
                <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Bookmark className="h-5 w-5" /> Merken
                </button>
                <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
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
        </>
      )}
    </AnimatePresence>
  );
}
