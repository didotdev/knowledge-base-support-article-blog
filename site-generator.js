const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const dataPath = path.join(rootDir, 'src', 'data', 'articles.json');
const outputDir = rootDir;
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const posts = data.posts;

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const buildPage = ({ title, body, current }) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="Developer-focused knowledge base and support blog for product updates, troubleshooting, engineering notes, and API guidance." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header class="topbar">
      <div class="container nav-wrap">
        <a href="index.html" class="brand" aria-label="Go to homepage">
          <div class="brand-mark">D</div>
          <span>${data.site.title}</span>
        </a>

        <nav class="main-nav" aria-label="Main navigation">
          <a href="index.html" class="${current === 'home' ? 'active' : ''}">Home</a>
          <a href="posts.html" class="${current === 'posts' ? 'active' : ''}">Posts</a>
          <a href="category.html" class="${current === 'category' ? 'active' : ''}">Categories</a>
          <a href="support.html" class="${current === 'support' ? 'active' : ''}">Support</a>
        </nav>

        <div class="nav-actions">
          <button class="theme-toggle" type="button" aria-label="Toggle theme">
            <span class="theme-icon">☀</span>
            <span class="theme-label">Light</span>
          </button>
          <a class="secondary-btn" href="support.html">Get help</a>
          <a class="primary-btn" href="category.html">Explore docs</a>
        </div>
      </div>
    </header>

    ${body}

    <footer class="site-footer">
      <div class="container footer-inner">
        <div>
          <div class="brand small">
            <div class="brand-mark">D</div>
            <span>${data.site.title}</span>
          </div>
          <p>${data.site.tagline}</p>
        </div>

        <div class="footer-links">
          <a href="index.html">Home</a>
          <a href="posts.html">Posts</a>
          <a href="category.html">Categories</a>
          <a href="support.html">Support</a>
        </div>
      </div>
    </footer>

    <script src="script.js"></script>
  </body>
</html>`;

const renderHomeBody = () => {
  const featured = posts[0];
  const categories = [
    { name: 'Getting started', icon: '⚙', tone: 'bg-blue', text: 'Setup guides, onboarding, and workflow basics for new teams.' },
    { name: 'Integrations', icon: '🧩', tone: 'bg-purple', text: 'Connect third-party services, APIs, and internal tooling with confidence.' },
    { name: 'Security', icon: '🛡', tone: 'bg-green', text: 'Access control, incident response, and secure platform operations.' },
    { name: 'Analytics', icon: '📈', tone: 'bg-orange', text: 'Performance monitoring, trend analysis, and business reporting.' }
  ];

  const cards = posts
    .map((post, index) => `
      <article class="post-card ${index === 0 ? 'featured' : ''}">
        <div class="post-tag ${index === 0 ? '' : 'alt'}">${escapeHtml(post.tag)}</div>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.description)}</p>
        <div class="meta-row">
          <span>${escapeHtml(post.readTime)}</span>
          <span>${escapeHtml(post.category)}</span>
          <span>${escapeHtml(post.date)}</span>
        </div>
        <a class="${index === 0 ? 'primary-btn small-btn' : 'secondary-btn small-btn'}" href="${post.slug}.html">Read article</a>
      </article>
    `)
    .join('');

  const categoryCards = categories
    .map(
      (category) => `
        <article class="category-card">
          <div class="icon ${category.tone}">${category.icon}</div>
          <h3>${category.name}</h3>
          <p>${category.text}</p>
        </article>
      `
    )
    .join('');

  return `
    <main>
      <section class="hero">
        <div class="container hero-inner">
          <div class="hero-copy">
            <span class="eyebrow">Developer knowledge base</span>
            <h1>Ship better products with clear docs and support insights.</h1>
            <p>Explore product updates, troubleshooting guides, API references, and engineering playbooks built for fast-moving teams.</p>
            <div class="search-box" role="search">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 4a6 6 0 104.56 10.28l4.72 4.72 1.41-1.41-4.72-4.72A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z"/></svg>
              <input type="text" aria-label="Search articles" placeholder="Search articles, docs, and guides" />
              <button type="button">Search</button>
            </div>
            <div class="quick-links">
              <span>Popular:</span>
              <a href="${featured.slug}.html">API auth</a>
              <a href="${posts[2].slug}.html">Deployments</a>
              <a href="${posts[3].slug}.html">SDK setup</a>
            </div>
          </div>

          <div class="hero-panel">
            <div class="panel-card highlight">
              <div class="panel-header"><span class="status-dot"></span><span>System health</span></div>
              <strong>99.98%</strong>
              <small>Uptime this month</small>
            </div>
            <div class="panel-card">
              <p>Latest update</p>
              <h3>Platform release notes</h3>
              <ul>
                <li>Faster queue processing</li>
                <li>Improved permission caching</li>
                <li>New webhook monitoring</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section class="container categories">
        <div class="section-heading">
          <span class="eyebrow muted">Browse topics</span>
          <h2>Support resources for every stage</h2>
        </div>
        <div class="category-grid">${categoryCards}</div>
      </section>

      <section class="container content-grid">
        <div class="feed">
          <div class="section-heading inline">
            <span class="eyebrow muted">Latest articles</span>
            <a href="posts.html">View all</a>
          </div>
          ${cards}
        </div>

        <aside class="sidebar">
          <div class="sidebar-box">
            <div class="section-heading inline minimal">
              <span class="eyebrow muted">Popular topics</span>
            </div>
            <ul class="popular-list">
              <li><a href="${posts[3].slug}.html">Webhook delivery failures</a></li>
              <li><a href="${posts[4].slug}.html">Authentication best practices</a></li>
              <li><a href="${posts[1].slug}.html">Migration checklist</a></li>
              <li><a href="${posts[0].slug}.html">Rate limiting patterns</a></li>
              <li><a href="${posts[5].slug}.html">SDK integration errors</a></li>
            </ul>
          </div>

          <div class="sidebar-box highlight-box">
            <span class="eyebrow muted">Need help?</span>
            <h3>Contact support</h3>
            <p>Get guidance from the engineering team for critical issues.</p>
            <a class="primary-btn full" href="support.html">Open ticket</a>
          </div>
        </aside>
      </section>
    </main>
  `;
};

const renderPostsBody = () => {
  const articleCards = posts
    .map(
      (post, index) => `
        <article class="post-card article-card" data-tags="${post.tags.join(',')}">
          <div class="post-tag ${index % 2 === 0 ? '' : 'alt'}">${escapeHtml(post.tag)}</div>
          <h3>${escapeHtml(post.title)}</h3>
          <p>${escapeHtml(post.description)}</p>
          <div class="meta-row">
            <span>${escapeHtml(post.readTime)}</span>
            <span>${escapeHtml(post.category)}</span>
          </div>
          <a class="${index % 2 === 0 ? 'primary-btn' : 'secondary-btn'} small-btn" href="${post.slug}.html">Read article</a>
        </article>
      `
    )
    .join('');

  return `
    <main class="page-shell">
      <section class="posts-header">
        <div class="container">
          <span class="eyebrow muted">Blog</span>
          <h1>Latest engineering and support articles</h1>
          <p>Explore release notes, troubleshooting guides, platform operations, and real-world engineering lessons from the DevBase team.</p>
        </div>
      </section>

      <section class="container">
        <div class="post-page-toolbar">
          <div class="search-box filter-box" role="search">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 4a6 6 0 104.56 10.28l4.72 4.72 1.41-1.41-4.72-4.72A6 6 0 0010 4zm0 2a4 4 0 110 8 4 4 0 010-8z"/></svg>
            <input id="postSearch" type="text" aria-label="Search posts" placeholder="Search posts, topics, or keywords" />
          </div>

          <div class="filters" aria-label="Filter posts by category">
            <button class="chip active" type="button" data-filter="all">All</button>
            <button class="chip" type="button" data-filter="engineering">Engineering</button>
            <button class="chip" type="button" data-filter="support">Support</button>
            <button class="chip" type="button" data-filter="operations">Operations</button>
            <button class="chip" type="button" data-filter="security">Security</button>
            <button class="chip" type="button" data-filter="integrations">Integrations</button>
          </div>
        </div>

        <div class="posts-grid">${articleCards}</div>
        <div class="no-results">No posts match your search. Try another keyword or filter.</div>
      </section>
    </main>
  `;
};

const renderCategoryBody = () => `
  <main class="page-shell">
    <div class="container narrow-page">
      <div class="section-heading">
        <span class="eyebrow muted">Browse by topic</span>
        <h1>Knowledge base categories</h1>
      </div>

      <div class="category-grid category-page-grid">
        <article class="category-card">
          <div class="icon bg-blue">⚙</div>
          <h3>Getting started</h3>
          <p>Setup guides, onboarding, and workflow basics for new teams.</p>
          <a class="mini-link" href="${posts[0].slug}.html">Browse articles</a>
        </article>
        <article class="category-card">
          <div class="icon bg-purple">🧩</div>
          <h3>Integrations</h3>
          <p>Connect third-party services, APIs, and internal tooling with confidence.</p>
          <a class="mini-link" href="${posts[3].slug}.html">Browse articles</a>
        </article>
        <article class="category-card">
          <div class="icon bg-green">🛡</div>
          <h3>Security</h3>
          <p>Access control, incident response, and secure platform operations.</p>
          <a class="mini-link" href="${posts[4].slug}.html">Browse articles</a>
        </article>
        <article class="category-card">
          <div class="icon bg-orange">📈</div>
          <h3>Analytics</h3>
          <p>Performance monitoring, trend analysis, and business reporting.</p>
          <a class="mini-link" href="${posts[5].slug}.html">Browse articles</a>
        </article>
      </div>

      <div class="list-panel">
        <h2>Popular posts</h2>
        <div class="post-list">
          ${posts.slice(0, 3).map((post) => `
            <a href="${post.slug}.html">
              <span>${escapeHtml(post.title)}</span>
              <small>${escapeHtml(post.category)}</small>
            </a>
          `).join('')}
        </div>
      </div>
    </div>
  </main>
`;

const renderSupportBody = () => `
  <main class="page-shell">
    <div class="container support-layout">
      <section class="support-copy">
        <div class="section-heading">
          <span class="eyebrow muted">Support</span>
          <h1>We’re here when things break.</h1>
        </div>
        <p>Reach out for troubleshooting, incident response, migration questions, or technical guidance from our engineering and support teams.</p>
        <div class="support-cards">
          <div class="mini-panel"><strong>Priority response</strong><span>Critical incidents: under 30 minutes</span></div>
          <div class="mini-panel"><strong>Average response</strong><span>General requests: within 4 hours</span></div>
        </div>
      </section>

      <section class="support-form-wrap">
        <form class="support-form">
          <div class="field-row"><label>Name<input type="text" placeholder="Your name" /></label></div>
          <div class="field-row"><label>Email<input type="email" placeholder="you@company.com" /></label></div>
          <div class="field-row"><label>Topic<select><option>Incident</option><option>Technical support</option><option>Migration</option><option>Billing</option></select></label></div>
          <div class="field-row"><label>Message<textarea rows="5" placeholder="Tell us what you need help with..."></textarea></label></div>
          <button class="primary-btn full" type="submit">Submit request</button>
        </form>
      </section>
    </div>
  </main>
`;

const renderArticleBody = (post) => {
  const related = posts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return `
    <main>
      <article class="article-shell">
        <div class="container article-layout">
          <div class="article-body">
            <div class="eyebrow">${escapeHtml(post.category)}</div>
            <h1>${escapeHtml(post.title)}</h1>
            <div class="article-meta">
              <span>${escapeHtml(post.date)}</span>
              <span>${escapeHtml(post.readTime)}</span>
              <span>By ${escapeHtml(post.category)} Team</span>
            </div>
            <p class="lead">${escapeHtml(post.description)}</p>
            ${post.content.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}
            <div class="article-callout"><strong>Outcome:</strong> ${escapeHtml(post.description)}</div>
          </div>

          <aside class="article-sidebar">
            <div class="sidebar-box">
              <span class="eyebrow muted">Related</span>
              <ul class="popular-list">
                ${related.map((item) => `<li><a href="${item.slug}.html">${escapeHtml(item.title)}</a></li>`).join('')}
              </ul>
            </div>
            <div class="sidebar-box highlight-box">
              <span class="eyebrow muted">Need guidance?</span>
              <h3>Talk to the team</h3>
              <p>Need help with rollout, monitoring, or incident response? We can help.</p>
              <a class="primary-btn full" href="support.html">Contact support</a>
            </div>
          </aside>
        </div>
      </article>
    </main>
  `;
};

const writeFile = (fileName, content) => {
  fs.writeFileSync(path.join(outputDir, fileName), content, 'utf8');
};

writeFile('index.html', buildPage({ title: `${data.site.title} | Knowledge Base & Blog`, body: renderHomeBody(), current: 'home' }));
writeFile('posts.html', buildPage({ title: 'Blog Posts | DevBase', body: renderPostsBody(), current: 'posts' }));
writeFile('category.html', buildPage({ title: 'Categories | DevBase', body: renderCategoryBody(), current: 'category' }));
writeFile('support.html', buildPage({ title: 'Support | DevBase', body: renderSupportBody(), current: 'support' }));

posts.forEach((post) => {
  writeFile(`${post.slug}.html`, buildPage({ title: `${post.title} | DevBase`, body: renderArticleBody(post), current: 'posts' }));
});

console.log(`Generated ${posts.length + 4} pages from the static site generator layout.`);
