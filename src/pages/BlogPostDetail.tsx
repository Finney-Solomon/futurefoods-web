import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import NewHeader from "@/components/NewHeader";
import NewsletterFooter from "@/components/NewsletterFooter";


type ContentImage = { url?: string; alt?: string };
type ContentList = { ordered?: boolean; items?: string[] };

type ContentBlock =
 | { type: "section"; subheading?: string; body?: string[]; list?: ContentList }
 | { type: "image"; image?: ContentImage }
 | { type: "quote"; quote?: string; cite?: string }
 | { type: "list"; subheading?: string; list?: ContentList }
 | { type: "html"; html?: string }
 | { type: "markdown"; markdown?: string };

type Author = { name?: string; avatar?: string };

export type BlogPost = {
 _id: string;
 heading: string;
 description?: string[];
 slug: string;
 coverImage?: string;
 content?: ContentBlock[];
 tags?: string[];
 author?: Author;
 status?: "draft" | "published";
 publishedAt?: string;
 createdAt?: string;
 updatedAt?: string;
 seo?: { title?: string; description?: string; ogImage?: string };
};

const formatDate = (iso?: string) =>
 iso
  ? new Date(iso).toLocaleDateString("en-IN", {
     year: "numeric",
     month: "long",
     day: "numeric",
     timeZone: "Asia/Kolkata",
    })
  : "";

const API_BASE = import.meta.env.VITE_API_URL || "";


const estimateReadTime = (text: string) => {
 const words = text.trim().split(/\s+/).length;
 const minutes = Math.max(1, Math.round(words / 220));
 return `${minutes} min read`;
};

const collectTOC = (blocks: ContentBlock[]) =>
 blocks
  .map((b, i) =>
   b.type === "section" && b.subheading
    ? { id: `sec-${i}`, title: b.subheading }
    : null
  )
  .filter(Boolean) as { id: string; title: string }[];

function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
 return (
  <div className="prose prose-lg max-w-none">
   {blocks.map((b, i) => {
    if (b.type === "section") {
     const id = `sec-${i}`;
     return (
      <section key={i} id={id} className="mt-12 scroll-mt-24">
       {b.subheading && (
        <h2 className="text-3xl font-bold text-[hsl(var(--ff-dark))] mb-6">
         {b.subheading}
        </h2>
       )}
       {(b.body || []).map((t, j) => (
        <p key={j} className="text-lg text-gray-700 leading-relaxed mb-8">
         {t}
        </p>
       ))}
       {b.list &&
        (b.list.items?.length || 0) > 0 &&
        (b.list.ordered ? (
         <ol className="list-decimal ml-6 space-y-2">
          {b.list.items!.map((it, k) => (
           <li key={k}>{it}</li>
          ))}
         </ol>
        ) : (
         <ul className="list-disc ml-6 space-y-2">
          {b.list.items!.map((it, k) => (
           <li key={k}>{it}</li>
          ))}
         </ul>
        ))}
      </section>
     );
    }
    if (b.type === "image") {
     return (
      <figure key={i} className="mt-12">
       <img
        src={b.image?.url || ""}
        alt={b.image?.alt || ""}
        className="w-full rounded-xl"
        loading="lazy"
       />
       {b.image?.alt && (
        <figcaption className="text-sm text-gray-500 mt-2">
         {b.image.alt}
        </figcaption>
       )}
      </figure>
     );
    }
    if (b.type === "quote") {
     return (
      <blockquote
       key={i}
       className="mt-12 border-l-4 border-gray-300 pl-4 italic"
      >
       <p>{b.quote}</p>
       {b.cite && <cite className="not-italic block mt-2">— {b.cite}</cite>}
      </blockquote>
     );
    }
    if (b.type === "list") {
     return (
      <section key={i} className="mt-12">
       {b.subheading && (
        <h3 className="text-2xl font-semibold mb-4">{b.subheading}</h3>
       )}
       {b.list?.ordered ? (
        <ol className="list-decimal ml-6 space-y-2">
         {b.list.items?.map((it, k) => (
          <li key={k}>{it}</li>
         ))}
        </ol>
       ) : (
        <ul className="list-disc ml-6 space-y-2">
         {b.list?.items?.map((it, k) => (
          <li key={k}>{it}</li>
         ))}
        </ul>
       )}
      </section>
     );
    }
    if (b.type === "html") {
     return (
      <div
       key={i}
       className="prose max-w-none mt-12"
       dangerouslySetInnerHTML={{ __html: b.html || "" }}
      />
     );
    }
    if (b.type === "markdown") {
     return (
      <pre
       key={i}
       className="mt-12 whitespace-pre-wrap break-words bg-gray-50 p-4 rounded"
      >
       {b.markdown}
      </pre>
     );
    }
    return null;
   })}
  </div>
 );
}

/** ===== Page ===== */
export default function BlogPostDetail() {
 const { slug } = useParams<{ slug: string }>();
 const navigate = useNavigate();
 const { state } = useLocation();
 const statePost = (state as { post?: BlogPost })?.post;

 const [post, setPost] = useState<BlogPost | null>(statePost || null);
 const [loading, setLoading] = useState<boolean>(!statePost);
 const [error, setError] = useState<string>("");

 const cacheKey = useMemo(() => (slug ? `blog:${slug}` : ""), [slug]);
 const abortRef = useRef<AbortController | null>(null);

 // Persist to cache when we have it (so refresh works)
 useEffect(() => {
  if (post && cacheKey) {
   try {
    sessionStorage.setItem(cacheKey, JSON.stringify(post));
   } catch {}
  }
 }, [post, cacheKey]);

 // Load from cache or fetch
 useEffect(() => {
  if (!slug) return;
  if (post) return;

  // cache
  try {
   const raw = sessionStorage.getItem(cacheKey);
   if (raw) {
    setPost(JSON.parse(raw) as BlogPost);
    setLoading(false);
    return;
   }
  } catch {}

  abortRef.current?.abort();
  const ac = new AbortController();
  abortRef.current = ac;

  setLoading(true);
  setError("");

  const url = `${API_BASE}/api/blogs/${encodeURIComponent(slug)}`;

  fetch(url, { signal: ac.signal })
   .then(async (res) => {
    if (!res.ok) {
     const body = await res.json().catch(() => ({}));
     throw new Error(body?.message || `Failed to load post (${res.status})`);
    }
    return res.json();
   })
   .then((data: BlogPost) => setPost(data))
   .catch((e: any) => {
    if (e?.name !== "AbortError") setError(e?.message || "Failed to load.");
   })
   .finally(() => setLoading(false));

  return () => ac.abort();
 }, [slug]); // keep minimal deps

 // Title + JSON-LD
 useEffect(() => {
  document.title = post?.heading
   ? `${post.heading} • Futurefoodz`
   : "Blog • Futurefoodz";
 }, [post?.heading]);

 const allTextForRT = useMemo(() => {
  const ds = (post?.description || []).join(" ");
  const cs = (post?.content || [])
   .map((b) =>
    b.type === "section"
     ? (b.body || []).join(" ")
     : b.type === "quote"
     ? b.quote || ""
     : b.type === "list"
     ? (b.list?.items || []).join(" ")
     : ""
   )
   .join(" ");
  return `${ds} ${cs}`;
 }, [post]);

 const toc = useMemo(() => collectTOC(post?.content || []), [post?.content]);

 if (loading) {
  return (
   <div className="min-h-screen bg-white">
    <NewHeader />
    <main className="py-20 px-6">
     <div className="max-w-3xl mx-auto animate-pulse">
      <div className="h-10 w-64 bg-gray-200 rounded mb-4" />
      <div className="h-5 w-40 bg-gray-200 rounded mb-8" />
      <div className="h-64 w-full bg-gray-200 rounded-xl mb-10" />
      <div className="space-y-3">
       <div className="h-4 bg-gray-200 rounded" />
       <div className="h-4 bg-gray-200 rounded w-11/12" />
       <div className="h-4 bg-gray-200 rounded w-10/12" />
      </div>
     </div>
    </main>
    <NewsletterFooter />
   </div>
  );
 }

 if (error || !post) {
  return (
   <div className="min-h-screen bg-white">
    <NewHeader />
    <main className="py-20 px-6">
     <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-3">
       {error ? "Couldn't load post" : "Post not found"}
      </h1>
      <p className="text-gray-600 mb-6">
       {error || "Open this post from the blog list."}
      </p>
      <button
       className="underline text-[hsl(var(--ff-navy))]"
       onClick={() => navigate("/blog")}
      >
       ← Back to blog
      </button>
     </div>
    </main>
    <NewsletterFooter />
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-white">
   <NewHeader />
   <main className="py-20 px-6">
    <div className="max-w-4xl mx-auto">
     {post.coverImage && (
      <img
       src={post.coverImage}
       alt={post.heading}
       className="w-full h-96 object-cover rounded-xl mb-12"
       loading="eager"
      />
     )}

     <div className="mb-6">
      <h1 className="text-5xl font-bold text-[hsl(var(--ff-dark))] mb-3 leading-tight">
       {post.heading}
      </h1>
      <div className="text-gray-600 text-lg flex flex-wrap items-center gap-x-3">
       <span>{post.author?.name || "Futurefoodz Team"}</span>
       {post.publishedAt && <span>• {formatDate(post.publishedAt)}</span>}
       {allTextForRT.trim() && <span>• {estimateReadTime(allTextForRT)}</span>}
      </div>
     </div>

     {/* TOC (if there are sections) */}
     {/* {toc.length > 0 && (
            <aside className="mb-10 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                On this page
              </p>
              <ul className="space-y-1 text-sm">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a
                      href={`#${t.id}`}
                      className="text-[hsl(var(--ff-navy))] hover:underline"
                    >
                      {t.title}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>
          )} */}

     {/* Description */}
     {(post.description?.length ?? 0) > 0 && (
      <div className="prose prose-lg max-w-none mb-6">
       {post.description!.map((p, i) => (
        <p key={i} className="text-lg text-gray-700 leading-relaxed">
         {p}
        </p>
       ))}
      </div>
     )}

     <ContentRenderer blocks={post.content || []} />

     {/* Tags */}
     {(post.tags?.length ?? 0) > 0 && (
      <div className="mt-12 flex flex-wrap gap-2">
       {post.tags!.map((tag) => (
        <span
         key={tag}
         className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 border"
        >
         #{tag}
        </span>
       ))}
      </div>
     )}

     <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
       __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.heading,
        image: post.coverImage ? [post.coverImage] : undefined,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        author: {
         "@type": "Organization",
         name: post.author?.name || "Futurefoodz Team",
        },
        mainEntityOfPage: {
         "@type": "WebPage",
         "@id":
          (typeof window !== "undefined" ? window.location.href : "") || "",
        },
        description:
         post.seo?.description || (post.description?.[0] || "").slice(0, 160),
       }),
      }}
     />
    </div>
   </main>
   <NewsletterFooter />
  </div>
 );
}
