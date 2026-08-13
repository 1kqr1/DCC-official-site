import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../blog/api';
import './Blog.css';

const formatDate = (d) => {
    const date = new Date(d);
    if (isNaN(date)) return d;
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

const Blog = () => {
    const [posts, setPosts] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPosts()
            .then(setPosts)
            .catch((err) => setError(err.message));
    }, []);

    return (
        <section className="blog">
            <div className="container">
                <div className="blog-header" data-reveal>
                    <span className="section-label">// BLOG</span>
                    <h1 className="blog-heading">活動ブログ</h1>
                    <p className="blog-sub">// DCCの日々の活動やイベントの様子をお届けします。</p>
                </div>

                {error && <p className="blog-empty">読み込みに失敗しました（{error}）。時間を置いて再度お試しください。</p>}

                {!error && posts === null && <p className="blog-empty">読み込み中...</p>}

                {posts && posts.length > 0 && (
                    <div className="blog-grid">
                        {posts.map((post, i) => (
                            <Link
                                to={`/blog/${post.slug}`}
                                className="blog-card"
                                key={post.slug}
                                data-reveal
                                style={{ '--reveal-delay': `${i * 0.07}s` }}
                            >
                                {post.thumbnailUrl && (
                                    <div className="blog-card-img-wrap">
                                        <img
                                            src={post.thumbnailUrl}
                                            alt={post.title}
                                            className="blog-card-img"
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                                <div className="blog-card-body">
                                    <time className="blog-card-date">
                                        <span className="blog-date-mark">//</span> {formatDate(post.publishedAt)}
                                    </time>
                                    <h2 className="blog-card-title">{post.title}</h2>
                                    {post.excerpt && <p className="blog-card-excerpt">{post.excerpt}</p>}
                                    {Array.isArray(post.tags) && post.tags.length > 0 && (
                                        <div className="blog-card-tags">
                                            {post.tags.map((tag) => (
                                                <span className="blog-tag" key={tag}>#{tag}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {posts && posts.length === 0 && (
                    <p className="blog-empty">まだ記事がありません。</p>
                )}
            </div>
        </section>
    );
};

export default Blog;
