import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getPost, thumbnailUrl } from '../blog/posts';
import './Blog.css';

const formatDate = (d) => {
    const date = new Date(d);
    if (isNaN(date)) return d;
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

// 本文中の相対パス画像（![](foo.jpg)）を public/blog-images/ 基準に解決する
const mdComponents = {
    img: ({ src = '', alt }) => {
        const isAbsolute = /^(https?:)?\/\//.test(src) || src.startsWith('/');
        const resolved = isAbsolute ? src : thumbnailUrl(src);
        return <img src={resolved} alt={alt} loading="lazy" />;
    },
};

const BlogPost = () => {
    const { slug } = useParams();
    const post = getPost(slug);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    if (!post) {
        return (
            <section className="blog">
                <div className="container blog-notfound">
                    <h1>記事が見つかりませんでした</h1>
                    <Link to="/blog" className="blog-back">← ブログ一覧へ戻る</Link>
                </div>
            </section>
        );
    }

    return (
        <article className="blog-post">
            <div className="container container-narrow">
                <Link to="/blog" className="blog-back">← ブログ一覧へ戻る</Link>

                <header className="blog-post-header">
                    <time className="blog-post-date">{formatDate(post.date)}</time>
                    <h1 className="blog-post-title">{post.title}</h1>
                    <div className="blog-post-meta">
                        {post.author && <span className="blog-post-author">{post.author}</span>}
                        {Array.isArray(post.tags) && post.tags.map((tag) => (
                            <span className="blog-tag" key={tag}>#{tag}</span>
                        ))}
                    </div>
                </header>

                {post.thumbnail && (
                    <img
                        src={thumbnailUrl(post.thumbnail)}
                        alt={post.title}
                        className="blog-post-hero"
                    />
                )}

                <div className="blog-post-body">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                        {post.content}
                    </ReactMarkdown>
                </div>

                <Link to="/blog" className="blog-back blog-back-bottom">← ブログ一覧へ戻る</Link>
            </div>
        </article>
    );
};

export default BlogPost;
