import { ArrowRight, UserRound } from "lucide-react";
import { Link } from "react-router";

type AnalysisItem = {
  id: string;
  date: string;
  dateLabel: string;
  number: string;
  title: string;
  summary: string;
  authors: string[];
  categories: string[];
  imageRef: string;
  actionLabel: string;
};

type AnalysisCardProps = {
  item: AnalysisItem;
  imagePosition: "left" | "right";
};

function getImagePath(imageRef: string) {
  return `/institutional/analyses/${imageRef}.jpg`;
}

export function AnalysisCard({ item, imagePosition }: AnalysisCardProps) {
  const image = (
    <div className="w-full overflow-hidden rounded-md">
      <img
        src={getImagePath(item.imageRef)}
        alt=""
        className="block aspect-[16/9] w-full object-cover object-center"
      />
    </div>
  );

  const content = (
    <div className="flex flex-col justify-center py-2">
      <div className="text-xs font-medium uppercase tracking-wide text-[#4764b5]">
        {item.dateLabel}
        <span className="mx-2">·</span>
        {item.number}
      </div>

      <h2 className="mt-2 font-serif text-3xl font-extrabold leading-tight text-[#102a8f]">
        {item.title}
      </h2>

      <p className="mt-4 text-sm leading-6 text-[#526bb1]">{item.summary}</p>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        {item.authors.map((author) => (
          <div key={author} className="flex min-w-0 items-center gap-2">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <UserRound className="size-5" aria-hidden="true" />
            </span>
            <span className="text-sm text-[#526bb1]">{author}</span>
          </div>
        ))}
      </div>

      <Link
        to={`/pages/analyses/${item.id}`}
        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#143bd4] hover:underline"
      >
        {item.actionLabel}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );

  return (
    <article className="grid gap-7 py-7 md:grid-cols-2 md:items-center">
      {imagePosition === "left" ? (
        <>
          {image}
          {content}
        </>
      ) : (
        <>
          <div className="md:order-2">{image}</div>
          <div className="md:order-1">{content}</div>
        </>
      )}
    </article>
  );
}
