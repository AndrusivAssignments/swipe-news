import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { Clock } from "lucide-react";
import type { NewsItem } from "@/data/news";

interface Props {
  item: NewsItem;
  isTop: boolean;
  index: number;
  onSwipe: (dir: "left" | "right") => void;
  onTap: () => void;
}

export function SwipeCard({ item, isTop, index, onSwipe, onTap }: Props) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-18, 0, 18]);
  const likeOpacity = useTransform(x, [20, 140], [0, 1]);
  const nopeOpacity = useTransform(x, [-140, -20], [1, 0]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 110;
    if (info.offset.x > threshold || info.velocity.x > 600) {
      onSwipe("right");
    } else if (info.offset.x < -threshold || info.velocity.x < -600) {
      onSwipe("left");
    }
  };

  return (
    <motion.article
      className="absolute inset-0 select-none"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        zIndex: 10 - index,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={false}
      animate={{
        scale: 1 - index * 0.04,
        y: index * 10,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileTap={{ cursor: "grabbing" }}
      onClick={() => isTop && Math.abs(x.get()) < 5 && onTap()}
    >
      <div className="relative h-full w-full overflow-hidden rounded-3xl bg-card shadow-[0_20px_60px_-15px_rgba(0,0,0,0.35)]">
        {/* Image */}
        <div className="relative h-[58%] w-full overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            draggable={false}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Category badge */}
          <div className="absolute left-4 top-4">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-lg">
              {item.category}
            </span>
          </div>

          {/* Time */}
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-sm">
            <Clock className="h-3 w-3" />
            {item.readTime}
          </div>

          {/* LIKE / NOPE stamps */}
          {isTop && (
            <>
              <motion.div
                style={{ opacity: likeOpacity }}
                className="absolute left-6 top-6 rotate-[-18deg] rounded-lg border-4 border-[var(--color-like)] px-4 py-1 text-2xl font-black tracking-wider text-[var(--color-like)]"
              >
                MEHR DAVON
              </motion.div>
              <motion.div
                style={{ opacity: nopeOpacity }}
                className="absolute right-6 top-6 rotate-[18deg] rounded-lg border-4 border-[var(--color-nope)] px-4 py-1 text-2xl font-black tracking-wider text-[var(--color-nope)]"
              >
                SKIP
              </motion.div>
            </>
          )}
        </div>

        {/* Text */}
        <div className="flex h-[42%] flex-col gap-3 p-5">
          <h2 className="font-display text-2xl font-bold leading-tight text-foreground">
            {item.title}
          </h2>
          <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
            {item.summary}
          </p>
          <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
            <span>{item.publishedAt}</span>
            <span className="font-semibold text-primary">Tippen zum Lesen →</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
