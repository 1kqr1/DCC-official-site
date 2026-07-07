import React from 'react';
import { Link } from 'react-router-dom';
import { posts, thumbnailUrl } from '../blog/posts';
import './Blog.css';

const formatDate = (d) => {
    const date = new Date(d);
    if (isNaN(date)) return d;
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

const Blog = () => {
    return (
        <section className="blog">
            <div className="container">
                <div className="blog-header">
                    <span className="section-label">BLOG</span>
                    <h1 className="blog-heading">活動ブログ</h1>
                    <p className="blog-sub">DCCの日々の活動やイベントの様子をお届けします。</p>
                </div>

                <div className="blog-grid">
                    {posts.map((post) => (
                        <Link to={`/blog/${post.slug}`} className="blog-card" key={post.slug}>
                            {post.thumbnail && (
                                <div className="blog-card-img-wrap">
                                    <img
                                        src={thumbnailUrl(post.thumbnail)}
                                        alt={post.title}
                                        className="blog-card-img"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                            <div className="blog-card-body">
                                <time className="blog-card-date">{formatDate(post.date)}</time>
                                <h2 className="blog-card-title">{post.title}</h2>
                                {post.excerpt && <p className="blog-card-excerpt">{post.excerpt}</p>}
                                {Array.isArray(post.tags) && (
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

                {posts.length === 0 && (
                    <p className="blog-empty">まだ記事がありません。</p>
                )}
            </div>
        </section>
    );
};

export default Blog;
