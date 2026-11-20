import fs from "fs";
import path from "path";
import type { Metadata } from "next";

type ScriptEntry = {
  type?: string;
  src?: string;
  async?: boolean;
  fetchPriority?: string;
  dataFramerBundle?: string;
  dataFramerAppearAnimation?: string;
  content?: string;
};

const FRAGMENTS_DIR = path.join(process.cwd(), "src/lib/marketing/fragments");

function readFragment(slug: string) {
  const dir = path.join(FRAGMENTS_DIR, slug);
  const stylesCss = fs.readFileSync(path.join(dir, "styles.css"), "utf-8");
  const bodyHtml = fs.readFileSync(path.join(dir, "body.html"), "utf-8");
  const scripts: ScriptEntry[] = JSON.parse(
    fs.readFileSync(path.join(dir, "scripts.json"), "utf-8"),
  );
  return { stylesCss, bodyHtml, scripts };
}

export function getMarketingMeta(slug: string) {
  const metaPath = path.join(FRAGMENTS_DIR, slug, "meta.json");
  return JSON.parse(fs.readFileSync(metaPath, "utf-8")) as {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string | null;
  };
}

export function buildMarketingMetadata(slug: string): Metadata {
  const meta = getMarketingMeta(slug);
  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      images: meta.ogImage ? [meta.ogImage] : undefined,
    },
  };
}

export function FramerPage({ slug }: { slug: string }) {
  const { stylesCss, bodyHtml, scripts } = readFragment(slug);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: stylesCss }} />
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      {scripts.map((s, i) =>
        s.src ? (
          <script
            key={i}
            type={s.type}
            src={s.src}
            async={s.async}
            fetchPriority={s.fetchPriority as "low" | "high" | "auto" | undefined}
            data-framer-bundle={s.dataFramerBundle}
          />
        ) : (
          <script
            key={i}
            type={s.type}
            data-framer-appear-animation={s.dataFramerAppearAnimation}
            dangerouslySetInnerHTML={{ __html: s.content ?? "" }}
          />
        ),
      )}
    </>
  );
}
