import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPost } from '../blog/api';
import './Blog.css';

const formatDate = (d) => {
    const date = new Date(d);
    if (isNaN(date)) return d;
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

const TextBlock = ({ text }) => (
    <>
        {text.split(/\n{2,}/).map((para, i) => (
            <p key={i}>
                {para.split('\n').map((line, j, arr) => (
                    <React.Fragment key={j}>
                        {line}
                        {j < arr.length - 1 && <br />}
                    </React.Fragment>
                ))}
            </p>
        ))}
    </>
);

const Block = ({ block }) => {
    switch (block.type) {
        case 'heading':
            return <h2>{block.text}</h2>;
        case 'text':
            return <TextBlock text={block.text} />;
        case 'image':
            return (
                <figure>
                    <img src={block.url} alt={block.alt} loading="lazy" />
                    {block.alt && <figcaption>{block.alt}</figcaption>}
                </figure>
            );
        default:
            return null;
    }
};

// 記事が切り替わったら key で中身ごと作り直す。
// 同じ画面を使い回すと、URLは新しい記事なのに前の記事のデータがまだ残っている状態で
// 一度描画されてしまい、前の記事が一瞬見えることがある。
const BlogPost = () => {
    const { slug } = useParams();
    return <BlogPostView key={slug} slug={slug} />;
};

const BlogPostView = ({ slug }) => {
    const [post, setPost] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        // 読み込み中に別のページへ移った場合、返ってきた結果は捨てる
        let cancelled = false;
        fetchPost(slug)
            .then((data) => {
                if (cancelled) return;
                if (!data) setNotFound(true);
                else setPost(data);
            })
            .catch((err) => {
                if (!cancelled) setError(err.message);
            });

        return () => { cancelled = true; };
    }, [slug]);

    if (notFound) {
        return (
            <section className="blog">
                <div className="container blog-notfound">
                    <h1>記事が見つかりませんでした</h1>
                    <Link to="/blog" className="blog-back">cd ../blog</Link>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="blog">
                <div className="container blog-notfound">
                    <h1>読み込みに失敗しました</h1>
                    <p className="muted">{error}</p>
                    <Link to="/blog" className="blog-back">cd ../blog</Link>
                </div>
            </section>
        );
    }

    if (!post) {
        return (
            <section className="blog">
                <div className="container blog-notfound">
                    <p>読み込み中...</p>
                </div>
            </section>
        );
    }

    return (
        <article className="blog-post">
            <div className="container container-narrow">
                <Link to="/blog" className="blog-back">cd ../blog</Link>

                <header className="blog-post-header">
                    <time className="blog-post-date">
                        <span className="blog-date-mark">//</span> {formatDate(post.publishedAt)}
                    </time>
                    <h1 className="blog-post-title">{post.title}</h1>
                    <div className="blog-post-meta">
                        {post.authorName && <span className="blog-post-author">{post.authorName}</span>}
                        {Array.isArray(post.tags) && post.tags.map((tag) => (
                            <span className="blog-tag" key={tag}>#{tag}</span>
                        ))}
                    </div>
                </header>

                {post.thumbnailUrl && (
                    <img
                        src={post.thumbnailUrl}
                        alt={post.title}
                        className="blog-post-hero"
                    />
                )}

                <div className="blog-post-body">
                    {post.blocks.map((block, i) => (
                        <Block block={block} key={i} />
                    ))}
                </div>

                <Link to="/blog" className="blog-back blog-back-bottom">cd ../blog</Link>
            </div>
        </article>
    );
};

export default BlogPost;
