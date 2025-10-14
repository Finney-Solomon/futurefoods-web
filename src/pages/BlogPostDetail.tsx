import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Blog as BlogPost } from "@/services/types/blogsTypes";
import NewHeader from "@/components/NewHeader";
import NewsletterFooter from "@/components/NewsletterFooter";

const formatDate = (iso?: string) =>
 iso
  ? new Date(iso).toLocaleDateString("en-IN", {
     year: "numeric",
     month: "long",
     day: "numeric",
     timeZone: "Asia/Kolkata",
    })
  : "";

export default function BlogPostDetail() {
 const { slug } = useParams<{ slug: string }>();
 const navigate = useNavigate();
 const { state } = useLocation();
 const statePost = (state as { post?: BlogPost })?.post;

 const [post, setPost] = useState<BlogPost | null>(statePost || null);

 useEffect(() => {
  if (post || !slug) return;
  // fallback: retrieve from session cache (handles refresh)
  try {
   const raw = sessionStorage.getItem(`blog:${slug}`);
   if (raw) setPost(JSON.parse(raw) as BlogPost);
  } catch {}
 }, [post, slug]);

 if (!post) {
  return (
   <div className="min-h-screen bg-white">
    <NewHeader />
    <main className="py-20 px-6">
     <div className="max-w-3xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-3">Post not found</h1>
      <p className="text-gray-600 mb-6">Open this post from the blog list.</p>
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
      />
     )}

     <div className="mb-12">
      <h1 className="text-5xl font-bold text-[hsl(var(--ff-dark))] mb-6 leading-tight">
       {post.heading}
      </h1>
      <p className="text-gray-600 text-lg">
       {post.author?.name || "Futurefoodz Team"}
       {post.publishedAt ? ` | ${formatDate(post.publishedAt)}` : ""}
      </p>
     </div>

     {/* Intro paragraphs */}
     <div className="prose prose-lg max-w-none">
      {(post.description || []).map((p, i) => (
       <p key={i} className="text-lg text-gray-700 leading-relaxed mb-8">
        {p}
       </p>
      ))}

      {/* Content blocks */}
      {(post.content || []).map((b, i) => {
       if (b.type === "section") {
        return (
         <section key={i} className="mt-12">
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
    </div>
   </main>
   <NewsletterFooter />
  </div>
 );
}