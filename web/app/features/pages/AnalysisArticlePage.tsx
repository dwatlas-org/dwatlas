import { ArrowLeft, Download, Quote, Share2 } from "lucide-react";
import { Link, Navigate, useParams } from "react-router";

import { AnalysisBarChart } from "@/components/pages/AnalysisBarChart";
import { PublicationInformation } from "@/components/pages/PublicationInformation";

import analysesContent from "./content/analyses.json";

function getImagePath(imageRef: string) {
  return `/institutional/analyses/${imageRef}.jpg`;
}

export function AnalysisArticlePage() {
  const { analysisId } = useParams();
  const article = analysesContent.article;

  if (!analysisId || analysisId !== article.id) {
    return <Navigate to="/pages/analyses" replace />;
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({
        title: article.title,
        text: article.subtitle,
        url: window.location.href,
      });
      return;
    }

    await navigator.clipboard.writeText(window.location.href);
  }

  async function handleCite() {
    await navigator.clipboard.writeText(
      article.publicationInformation.recommendedCitation,
    );
  }

  function handleDownload() {
    const content = [
      article.title,
      article.subtitle,
      "",
      ...article.introParagraphs,
      "",
      ...article.sections.flatMap((section) => [
        section.title,
        ...section.paragraphs,
        ...(section.afterChartParagraphs ?? []),
      ]),
    ].join("\n\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${article.id}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="w-full bg-white">
      <div className="border-b border-blue-50 bg-sky-50/60">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-2 px-6 py-3 text-xs text-[#3551a4] md:px-8">
          <Link
            to="/pages/analyses"
            className="inline-flex items-center gap-1 hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Analyses
          </Link>
          <span>/</span>
          <span className="truncate">{article.title}</span>
        </div>
      </div>

      <article className="mx-auto w-full max-w-6xl px-6 py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <div className="text-sm font-medium uppercase tracking-wide text-[#4764b5]">
              {article.number} <span className="mx-2">|</span>{" "}
              {article.dateLabel}
            </div>

            <h1 className="mt-3 font-serif text-4xl font-extrabold leading-[1.05] tracking-tight text-[#102a8f] md:text-6xl">
              {article.title}
            </h1>

            <div className="mt-4 h-0.5 w-14 bg-[#ff5b24]" />

            <p className="mt-4 max-w-3xl text-lg leading-7 text-[#3551a4]">
              {article.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCite}
              className="inline-flex items-center gap-2 rounded-md border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-[#102a8f] hover:bg-sky-50"
            >
              <Quote className="h-4 w-4" />
              Cite
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-2 rounded-md border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-[#102a8f] hover:bg-sky-50"
            >
              <Download className="h-4 w-4" />
              Download
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-2 rounded-md bg-[#0b3d91] px-4 py-2 text-sm font-semibold text-white hover:bg-[#082f73]"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-[#102a8f]">
            {article.authors.join(", ")}
          </p>
          <p className="mt-1 text-sm text-[#526bb1]">
            With contributions from: {article.contributors.join(", ")}
          </p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {article.categories.map((category) => (
            <span
              key={category}
              className="rounded-md bg-sky-50 px-4 py-2 text-xs font-semibold text-[#143bd4]"
            >
              {category}
            </span>
          ))}
        </div>

        <figure className="mt-6">
          <img
            src={getImagePath(article.heroImage.imageRef)}
            alt={article.heroImage.alt}
            className="max-h-[560px] w-full rounded-md object-cover"
          />
          <figcaption className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#526bb1]">
            <span>
              <strong>Illustration:</strong> {article.heroImage.credit}
            </span>
            <span>
              {article.heroImage.workTitle}, {article.heroImage.year}
            </span>
            <span>{article.heroImage.technique}.</span>
          </figcaption>
        </figure>

        <div className="mt-7 space-y-4 text-[15px] leading-7 text-[#3551a4] md:text-base">
          {article.introParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {article.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            className="mt-10 border-t border-blue-100 pt-7"
          >
            <h2 className="font-serif text-3xl font-extrabold leading-tight text-[#102a8f] md:text-4xl">
              {section.title}
            </h2>

            <div className="mt-4 space-y-4 text-[15px] leading-7 text-[#3551a4] md:text-base">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {section.chart ? (
              <div className="mt-6">
                <AnalysisBarChart chart={section.chart} />
              </div>
            ) : null}

            {section.afterChartParagraphs?.length ? (
              <div className="mt-5 space-y-4 text-[15px] leading-7 text-[#3551a4] md:text-base">
                {section.afterChartParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            ) : null}
          </section>
        ))}

        <div className="mt-8">
          <PublicationInformation
            information={article.publicationInformation}
          />
        </div>
      </article>
    </main>
  );
}
