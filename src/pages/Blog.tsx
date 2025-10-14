import React, { useEffect, useState } from "react";
import NewHeader from "@/components/NewHeader";
import NewsletterFooter from "@/components/NewsletterFooter";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/api";
import { Link } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Blog as BlogPost } from "@/services/types/blogsTypes";

const BlogPost = () => {
 const navigate = useNavigate();

 const [featured, setFeatured] = useState<BlogPost | null>(null);
 const [posts, setPosts] = useState<BlogPost[]>([]);
 const [loading, setLoading] = useState(true);
 const [err, setErr] = useState<string | null>(null);
 console.log(featured, "featuredfeaturedfeatured", posts);
 useEffect(() => {
  let mounted = true;
  (async () => {
   try {
    // Featured (won’t 404 your UI if none exists)
    let feat: BlogPost | null = null;
    try {
     feat = await apiService.getFeaturedBlog();
    } catch {
     feat = null;
    }

    const list = await apiService.getBlogsPublic({ page: 1, limit: 9 });
    if (!mounted) return;

    setFeatured(feat);
    setPosts(list.items || []);
   } catch (e: any) {
    setErr(e?.message || "Failed to load blogs");
   } finally {
    if (mounted) setLoading(false);
   }
  })();
  return () => {
   mounted = false;
  };
 }, []);
 const blogPosts = [
  {
   id: 1,
   image:
    "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&h=300",
   title: "5 High-Protein Dinners to Make with Tempeh This Week",
   excerpt:
    "Tired of the same old tofu? Tempeh is the versatile, protein-packed ingredient your meals have been missing. Get inspired with these five easy recipes.",
  },
  {
   id: 2,
   image:
    "https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=400&h=300",
   title: "Kimchi vs. Tempeh: Which Fermented Food is Right for You?",
   excerpt:
    "Both are nutritional powerhouses, but they offer different benefits and flavors. We break down the science behind these two gut-friendly staples.",
  },
  {
   id: 3,
   image:
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=400&h=300",
   title: "Our Founder's Secret to Perfect Kimchi Fried Rice",
   excerpt:
    "The key to unbelievably good kimchi fried rice isn't just the kimchi—it's the technique. Learn the simple secret that makes all the difference.",
  },
 ];

 const formatDate = (iso?: string) => {
  if (!iso) return "";
  // Format for Asia/Kolkata; tweak options as you like
  return new Date(iso).toLocaleDateString("en-IN", {
   year: "numeric",
   month: "long",
   day: "numeric",
   timeZone: "Asia/Kolkata",
  });
 };
 const trimLines = (text = "", lines = 4, charsPerLine = 90) =>
  text.length > lines * charsPerLine
   ? text.slice(0, lines * charsPerLine).replace(/\s+\S*$/, "") + "…"
   : text;

 const openPost = (post: BlogPost) => {
  console.log(post, "postpostpostpost");
  // optional: persist for refresh/hard reload
  try {
   sessionStorage.setItem(`blog:${post.slug}`, JSON.stringify(post));
  } catch {}
  // pass the full object (or just slug) via state
  navigate(`/blog/${post.slug}`, { state: { post } });
 };

 return (
  <div className="min-h-screen bg-white">
   <NewHeader />

   <main className="py-20 px-6">
    <div className="max-w-7xl mx-auto">
     {/* Page Header */}
     <div className="text-center mb-16">
      <h1 className="text-5xl font-bold text-[hsl(var(--ff-dark))] mb-6">
       From the Futurefoodz Kitchen
      </h1>
     </div>

     {/* Featured Post */}

     {/* Featured Post */}
     {featured && (
      <div className="bg-gray-50 rounded-xl overflow-hidden mb-16 hover:shadow-lg transition-shadow">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        <div className="order-2 lg:order-1 p-12 flex flex-col justify-center">
         {/* Title */}
         <h2 className="text-3xl font-bold text-[hsl(var(--ff-dark))] mb-2">
          {featured?.heading}
         </h2>

         {/* Meta: author • date */}
         <p className="text-sm text-gray-500 mb-6">
          {featured?.author?.name || "Futurefoodz Team"}
          {featured?.publishedAt && <> • {formatDate(featured?.publishedAt)}</>}
         </p>

         {/* Intro/description (first paragraph) */}
         <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          {trimLines(featured?.description?.[0] || "", 2)}
         </p>

         <div>
          <Button
           className="bg-[hsl(var(--ff-yellow))] text-[hsl(var(--ff-dark))] hover:bg-[hsl(var(--ff-yellow))]/90 rounded-full px-8 py-3 text-lg font-semibold"
           onClick={() => featured && openPost(featured)}
          >
           Read More
          </Button>

          {/* <Link href={`/blog/${featured?.slug}`}> */}
          {/* <Button
           onClick={() => openPost(featured)}
           className="bg-[hsl(var(--ff-yellow))] text-[hsl(var(--ff-dark))] hover:bg-[hsl(var(--ff-yellow))]/90 rounded-full px-8 py-3 text-lg font-semibold"
          >
           Read More
          </Button> */}
          {/* </Link> */}
         </div>
        </div>

        {/* Image */}
        <div className="order-1 lg:order-2">
         <img
          src={
           featured.coverImage ||
           "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&h=400"
          }
          alt={featured.heading}
          className="w-full h-full object-cover"
         />
        </div>
       </div>
      </div>
     )}

     {/* BlogPost Post Grid */}
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts?.map((post) => (
       <article
        key={post._id}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
       >
        <img
         src={post.coverImage}
         alt={post.heading}
         className="w-full h-48 object-cover"
        />
        <div className="p-6">
         <h3 className="text-xl font-bold text-[hsl(var(--ff-dark))] mb-4 leading-tight">
          {post.heading}
         </h3>
         <p className="text-gray-600 mb-6 leading-relaxed">
          {trimLines(post?.description?.[0] || "", 2)}
         </p>
         <Button
          variant="outline"
          className="border-[hsl(var(--ff-navy))] text-[hsl(var(--ff-navy))] hover:bg-[hsl(var(--ff-navy))] hover:text-white rounded-full px-6"
          onClick={() => openPost(post)}
         >
          Read More
         </Button>
        </div>
       </article>
      ))}
     </div>
    </div>
   </main>

   <NewsletterFooter />
  </div>
 );
};

export default BlogPost;
