import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/lib/dictionaries";
import { AIRBNB_URL } from "@/lib/site";

import "./blog.css";

/**
 * The blog is an ordinary document: no stage, no engine, no scroll track.
 * English only (see lib/blog.ts), so the header drops its language switch.
 */
export default async function BlogLayout({ children }: LayoutProps<"/[lang]/blog">) {
  const dict = await getDictionary("en");

  return (
    <>
      <a href="#content" className="skip">
        Skip to content
      </a>
      <SiteHeader nav={dict.nav} locale="en" onBlog />
      <div id="content" className="blog">
        {children}
      </div>
      <footer className="blog-foot">
        <p className="blog-foot__mark">Costa Nativa</p>
        <p>{dict.footer.tagline}</p>
        <p>
          <a href={AIRBNB_URL} target="_blank" rel="noopener noreferrer">
            {dict.nav.book}
          </a>
        </p>
        <p className="blog-foot__small">
          © {new Date().getFullYear()} Costa Nativa. {dict.footer.rights}
        </p>
      </footer>
    </>
  );
}
