// Blog: posts are listed in blog/posts.json, and each post's content
// lives in blog/posts/<slug>.md. See blog/README.md for how to add one.

const POSTS_URL = 'posts.json';

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(isoDate) {
    return new Date(isoDate + 'T00:00:00').toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function readingTime(markdown) {
    const words = markdown.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200)) + ' min read';
}

// Published posts only, newest first
async function loadPosts() {
    const response = await fetch(POSTS_URL);
    if (!response.ok) throw new Error('Could not load posts.json');
    const posts = await response.json();
    return posts
        .filter(post => !post.draft)
        .sort((a, b) => b.date.localeCompare(a.date));
}

function tagsHtml(tags) {
    return (tags || []).map(tag => `<span class="post-tag">${escapeHtml(tag)}</span>`).join('');
}

async function renderPostList() {
    const list = document.getElementById('post-list');
    try {
        const posts = await loadPosts();
        if (posts.length === 0) {
            list.innerHTML = '<p class="blog-status">No posts yet — check back soon.</p>';
            return;
        }
        list.innerHTML = posts.map(post => `
            <a class="post-card" href="post.html?slug=${encodeURIComponent(post.slug)}">
                <div class="project-gradient gradient-1"></div>
                <div class="post-card-content">
                    <time class="post-date" datetime="${escapeHtml(post.date)}">${formatDate(post.date)}</time>
                    <h2>${escapeHtml(post.title)}</h2>
                    <p>${escapeHtml(post.summary || '')}</p>
                    <div class="post-tags">${tagsHtml(post.tags)}</div>
                </div>
            </a>
        `).join('');
    } catch (error) {
        list.innerHTML = '<p class="blog-status">Sorry, the posts couldn\'t be loaded.</p>';
        console.error(error);
    }
}

async function renderPost() {
    const title = document.getElementById('post-title');
    const meta = document.getElementById('post-meta');
    const body = document.getElementById('post-body');
    const slug = new URLSearchParams(window.location.search).get('slug');

    try {
        // Only fetch slugs that exist in posts.json
        const posts = await loadPosts();
        const post = posts.find(p => p.slug === slug);
        if (!post) {
            title.textContent = 'Post not found';
            body.innerHTML = '<p>That post doesn\'t exist. <a href="index.html">See all posts</a>.</p>';
            return;
        }

        const response = await fetch(`posts/${encodeURIComponent(post.slug)}.md`);
        if (!response.ok) throw new Error(`Could not load posts/${post.slug}.md`);
        const markdown = await response.text();

        document.title = `${post.title} - Jacob S`;
        document.querySelector('meta[name="description"]').setAttribute('content', post.summary || post.title);
        title.textContent = post.title;
        meta.innerHTML = `
            <time datetime="${escapeHtml(post.date)}">${formatDate(post.date)}</time>
            <span>·</span>
            <span>${readingTime(markdown)}</span>
            ${tagsHtml(post.tags)}
        `;
        body.innerHTML = marked.parse(markdown);
    } catch (error) {
        title.textContent = 'Something went wrong';
        body.innerHTML = '<p>Sorry, this post couldn\'t be loaded. <a href="index.html">See all posts</a>.</p>';
        console.error(error);
    }
}

// Mobile menu toggle (matches the homepage)
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});

// Navbar shadow on scroll (matches the homepage)
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.pageYOffset > 50);
});
