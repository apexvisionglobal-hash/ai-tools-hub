let activeFilter = 'all';
let searchQuery = '';

function stars(rating){
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5-full-half);
}

function renderTools(){
  const grid = document.getElementById('toolsGrid');
  if(!grid) return;
  let filtered = TOOLS.filter(t => {
    const matchCat = activeFilter === 'all' || t.cat === activeFilter;
    const matchSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery) || t.cat.toLowerCase().includes(searchQuery) || t.desc.toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  }).sort((a,b) => b.rating - a.rating);

  if(filtered.length === 0){
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:3rem;color:var(--muted)">No tools found. Try a different search or filter.</div>';
    return;
  }
  grid.innerHTML = filtered.map(t => `
    <div class="tool-card">
      <div class="tool-top">
        <div style="display:flex;align-items:center;gap:10px;flex:1">
          <div class="tool-icon" style="background:${t.color}22;color:${t.color}">${t.icon}</div>
          <div>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <span class="tool-name">${t.name}</span>
              <span class="tool-badge badge-${t.pricing.toLowerCase()}">${t.pricing}</span>
            </div>
            <span class="tool-category-tag">${t.cat}</span>
          </div>
        </div>
      </div>
      <p class="tool-desc">${t.desc}</p>
      <div class="tool-rating">
        <span class="stars">${stars(t.rating)}</span>
        <span class="rating-num">${t.rating}</span>
        <span class="review-count">(${t.reviews} reviews)</span>
      </div>
      <div class="pros-cons">
        <div class="pros-cons-box">
          <div class="pros-cons-title pros-title">✓ Pros</div>
          <ul class="pros-cons-list">${t.pros.map(p=>`<li>${p}</li>`).join('')}</ul>
        </div>
        <div class="pros-cons-box">
          <div class="pros-cons-title cons-title">✗ Cons</div>
          <ul class="pros-cons-list">${t.cons.map(c=>`<li>${c}</li>`).join('')}</ul>
        </div>
      </div>
      <div class="tool-footer">
        <a href="${t.url}" target="_blank" rel="noopener" class="tool-link">
          Visit Tool <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 10L10 2M10 2H5M10 2v5"/></svg>
        </a>
        <span class="tool-pricing">${t.pricingDetail}</span>
      </div>
    </div>
  `).join('');
}

function renderSaas(){
  const grid = document.getElementById('saasGrid');
  if(!grid) return;
  grid.innerHTML = SAAS_PRODUCTS.map(p => `
    <div class="saas-card fade-in">
      <div class="saas-coming-badge">Coming Soon</div>
      <div class="saas-icon" style="background:${p.color}">${p.icon}</div>
      <div class="saas-name">${p.name}</div>
      <p class="saas-desc">${p.desc}</p>
      <div class="saas-features">${p.features.map(f=>`<div class="saas-feature">${f}</div>`).join('')}</div>
      <button class="notify-btn" onclick="showToast('You\\'ll be notified when ${p.name} launches! 🚀')">Notify Me at Launch</button>
    </div>
  `).join('');
}

function renderBlogPreview(){
  const grid = document.getElementById('blogPreview');
  if(!grid) return;
  const preview = BLOGS.slice(0,3);
  grid.innerHTML = preview.map(b => `
    <a href="blog/${b.slug}.html" class="blog-card fade-in">
      <div class="blog-tag">${b.tag}</div>
      <div class="blog-title">${b.title}</div>
      <p class="blog-excerpt">${b.excerpt}</p>
      <div class="blog-meta">
        <span>📅 ${b.date}</span>
        <span>⏱ ${b.readTime}</span>
      </div>
      <span class="blog-read">Read Article →</span>
    </a>
  `).join('');
}

function renderBlogFull(){
  const grid = document.getElementById('blogFullGrid');
  if(!grid) return;
  grid.innerHTML = BLOGS.map(b => `
    <a href="${b.slug}.html" class="blog-card fade-in">
      <div class="blog-tag">${b.tag}</div>
      <div class="blog-title">${b.title}</div>
      <p class="blog-excerpt">${b.excerpt}</p>
      <div class="blog-meta">
        <span>📅 ${b.date}</span>
        <span>⏱ ${b.readTime}</span>
      </div>
      <span class="blog-read">Read Article →</span>
    </a>
  `).join('');
}

function setFilter(cat, btn){
  activeFilter = cat;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTools();
}

function filterTools(){
  searchQuery = document.getElementById('searchInput').value.toLowerCase();
  renderTools();
}

function showToast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function subscribe(){
  const input = document.getElementById('emailInput');
  if(!input) return;
  const email = input.value;
  if(!email || !email.includes('@')){showToast('Please enter a valid email address.');return;}
  input.value = '';
  showToast('Subscribed! Welcome to AI Tools Hub 🎉');
}

// Scroll animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
},{threshold:0.1});

document.addEventListener('DOMContentLoaded', () => {
  renderTools();
  renderSaas();
  renderBlogPreview();
  renderBlogFull();
  setTimeout(() => document.querySelectorAll('.fade-in').forEach(el => observer.observe(el)), 100);
});
