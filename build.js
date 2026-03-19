#!/usr/bin/env node
// Simple static site builder for Tangy TD Guide

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy public files
function copyPublic() {
  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir);
    for (const file of files) {
      const srcPath = path.join(publicDir, file);
      const destPath = path.join(distDir, file);
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Read translation files
const en = JSON.parse(fs.readFileSync(path.join(srcDir, 'i18n', 'en.json'), 'utf-8'));
const zh = JSON.parse(fs.readFileSync(path.join(srcDir, 'i18n', 'zh.json'), 'utf-8'));

// Generate HTML for a page
function generatePage(title, description, content, lang = 'en') {
  const t = lang === 'zh' ? zh : en;
  const baseUrl = lang === 'zh' ? '/zh' : '';
  
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${t.site.keywords}">
  <link rel="canonical" href="https://tangytd-guide.pages.dev${baseUrl}">
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="https://tangytd-guide.pages.dev/og-image.jpg">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": "Tangy TD",
    "description": description,
    "url": "https://tangytd-guide.pages.dev",
    "genre": ["Tower Defense", "Strategy", "Indie"],
    "gamePlatform": ["PC", "Steam"]
  })}</script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    .gradient-text { background: linear-gradient(to right, #c084fc, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  </style>
</head>
<body class="min-h-screen bg-slate-950 text-white">
  ${generateNav(t, lang)}
  <main class="pt-16">
    ${content}
  </main>
  ${generateFooter(t)}
</body>
</html>`;
}

function generateNav(t, lang) {
  const baseUrl = lang === 'zh' ? '/zh' : '';
  const otherUrl = lang === 'zh' ? '/' : '/zh';
  
  return `<nav class="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md shadow-lg shadow-purple-900/20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <a href="${baseUrl || '/'}" class="flex items-center gap-2">
          <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span class="text-white font-bold text-xl">T</span>
          </div>
          <span class="text-xl font-bold gradient-text">Tangy TD</span>
        </a>
        <div class="hidden md:flex items-center gap-1">
          <a href="${baseUrl}/classes.html" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5">${t.nav.classes}</a>
          <a href="${baseUrl}/skill-tree.html" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5">${t.nav.skillTree}</a>
          <a href="${baseUrl}/items.html" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5">${t.nav.items}</a>
          <a href="${baseUrl}/bosses.html" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5">${t.nav.bosses}</a>
          <a href="${baseUrl}/guide.html" class="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5">${t.nav.guide}</a>
          <a href="${otherUrl}" class="ml-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5">${lang === 'zh' ? 'EN' : '中文'}</a>
        </div>
      </div>
    </div>
  </nav>`;
}

function generateFooter(t) {
  return `<footer class="py-12 bg-slate-950 border-t border-white/10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-3 gap-8 mb-8">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span class="text-white font-bold text-2xl">T</span>
            </div>
            <div>
              <div class="text-xl font-bold text-white">Tangy TD</div>
              <div class="text-sm text-slate-500">${t.nav.guide}</div>
            </div>
          </div>
          <p class="text-slate-400 text-sm">${t.footer.about}</p>
        </div>
        <div>
          <h4 class="font-semibold text-slate-200 mb-4">${t.footer.quickLinks}</h4>
          <div class="space-y-3">
            <a href="https://store.steampowered.com/app/2245620/Tangy_TD/" target="_blank" rel="noopener" class="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors">Steam</a>
            <a href="https://tangytd.wiki/" target="_blank" rel="noopener" class="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors">Wiki</a>
            <a href="https://discord.gg/jVSX7YmEHj" target="_blank" rel="noopener" class="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors">Discord</a>
          </div>
        </div>
        <div>
          <h4 class="font-semibold text-slate-200 mb-4">${t.footer.aboutSite}</h4>
          <p class="text-slate-400 text-sm">${t.footer.about}</p>
        </div>
      </div>
      <div class="pt-8 border-t border-white/10 text-center">
        <p class="text-slate-500 text-sm">${t.footer.copyright}</p>
      </div>
    </div>
  </footer>`;
}

// ===== PAGE CONTENT GENERATORS =====

function generateHero(t, lang) {
  const baseUrl = lang === 'zh' ? '/zh' : '';
  return `<section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url(/hero-banner.jpg)">
      <div class="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950"></div>
    </div>
    <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-8">
        <span>${t.hero.badge}</span>
      </div>
      <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
        <span class="gradient-text">${t.hero.title}</span>
      </h1>
      <p class="text-xl sm:text-2xl text-slate-300 mb-4">${t.hero.subtitle}</p>
      <p class="text-slate-400 max-w-2xl mx-auto mb-12">${t.hero.description}</p>
      <div class="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-12">
        <div class="text-center"><div class="text-3xl sm:text-4xl font-bold text-purple-400 mb-1">3</div><div class="text-sm text-slate-400">${t.hero.stats.classes}</div></div>
        <div class="text-center"><div class="text-3xl sm:text-4xl font-bold text-pink-400 mb-1">100+</div><div class="text-sm text-slate-400">${t.hero.stats.items}</div></div>
        <div class="text-center"><div class="text-3xl sm:text-4xl font-bold text-orange-400 mb-1">300+</div><div class="text-sm text-slate-400">${t.hero.stats.nodes}</div></div>
      </div>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a href="${baseUrl}/classes.html" class="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-white shadow-lg hover:scale-105 transition-all">${t.hero.cta.classes}</a>
        <a href="${baseUrl}/guide.html" class="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl font-semibold text-white hover:bg-white/20 hover:scale-105 transition-all">${t.hero.cta.guide}</a>
      </div>
    </div>
  </section>`;
}

function generateClassesPreview(t, lang) {
  const baseUrl = lang === 'zh' ? '/zh' : '';
  return `<section class="py-24 bg-slate-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-4xl sm:text-5xl font-bold mb-4"><span class="gradient-text">${t.classes.title}</span></h2>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">${t.classes.subtitle}</p>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        <a href="${baseUrl}/classes.html" class="group">
          <div class="relative overflow-hidden rounded-2xl border-2 border-blue-500/30 bg-blue-500/10 hover:border-blue-500/50 transition-all">
            <img src="/defender-class.jpg" alt="Defender" class="w-full aspect-square object-cover group-hover:scale-105 transition-transform" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6">
              <h3 class="text-xl font-bold text-white">${t.classes.defender.name}</h3>
              <span class="text-xs text-blue-400">${t.classes.defender.role}</span>
              <p class="text-sm text-slate-400 mt-2">${t.classes.defender.description}</p>
            </div>
          </div>
        </a>
        <a href="${baseUrl}/classes.html" class="group">
          <div class="relative overflow-hidden rounded-2xl border-2 border-green-500/30 bg-green-500/10 hover:border-green-500/50 transition-all">
            <img src="/archer-class.jpg" alt="Archer" class="w-full aspect-square object-cover group-hover:scale-105 transition-transform" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6">
              <h3 class="text-xl font-bold text-white">${t.classes.archer.name}</h3>
              <span class="text-xs text-green-400">${t.classes.archer.role}</span>
              <p class="text-sm text-slate-400 mt-2">${t.classes.archer.description}</p>
            </div>
          </div>
        </a>
        <a href="${baseUrl}/classes.html" class="group">
          <div class="relative overflow-hidden rounded-2xl border-2 border-yellow-500/30 bg-yellow-500/10 hover:border-yellow-500/50 transition-all">
            <img src="/healer-class.jpg" alt="Healer" class="w-full aspect-square object-cover group-hover:scale-105 transition-transform" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            <div class="absolute bottom-0 left-0 right-0 p-6">
              <h3 class="text-xl font-bold text-white">${t.classes.healer.name}</h3>
              <span class="text-xs text-yellow-400">${t.classes.healer.role}</span>
              <p class="text-sm text-slate-400 mt-2">${t.classes.healer.description}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  </section>`;
}

function generateClassesPage(t, lang) {
  const classes = [
    { key: 'defender', color: 'blue', img: '/defender-class.jpg' },
    { key: 'archer', color: 'green', img: '/archer-class.jpg' },
    { key: 'healer', color: 'yellow', img: '/healer-class.jpg' }
  ];
  
  let content = `<section class="py-24 bg-slate-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h1 class="text-4xl sm:text-5xl font-bold mb-4"><span class="gradient-text">${t.classes.title}</span></h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">${t.classes.subtitle}</p>
      </div>
      <div class="space-y-24">`;
  
  classes.forEach((cls, index) => {
    const classData = t.classes[cls.key];
    const isReversed = index % 2 === 1;
    content += `
      <div class="grid lg:grid-cols-2 gap-8 items-center">
        <div class="relative group ${isReversed ? 'lg:order-2' : ''}">
          <div class="absolute inset-0 bg-gradient-to-br from-${cls.color}-500 to-${cls.color === 'blue' ? 'cyan' : cls.color === 'green' ? 'emerald' : 'orange'}-500 rounded-2xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
          <div class="relative overflow-hidden rounded-2xl border-2 border-white/10">
            <img src="${cls.img}" alt="${classData.name}" class="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        </div>
        <div class="space-y-6 ${isReversed ? 'lg:order-1' : ''}">
          <div>
            <div class="flex items-center gap-3 mb-2">
              <h2 class="text-3xl font-bold text-${cls.color}-400">${classData.name}</h2>
              <span class="px-3 py-1 rounded-full text-xs font-medium bg-${cls.color}-500/20 border border-${cls.color}-500/30">${classData.role}</span>
            </div>
            <p class="text-slate-400">${classData.description}</p>
          </div>
          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-slate-300 uppercase tracking-wider">Stats</h3>`;
    
    const stats = [
      { label: classData.stats.hp, value: cls.key === 'defender' ? 95 : cls.key === 'archer' ? 45 : 60, color: 'green' },
      { label: classData.stats.defense, value: cls.key === 'defender' ? 90 : cls.key === 'archer' ? 30 : 45, color: 'blue' },
      { label: classData.stats.attack, value: cls.key === 'defender' ? 50 : cls.key === 'archer' ? 85 : 40, color: 'red' },
      { label: classData.stats.speed, value: cls.key === 'defender' ? 40 : cls.key === 'archer' ? 95 : cls.key === 'healer' ? 95 : 40, color: 'yellow' }
    ];
    
    stats.forEach(stat => {
      content += `
            <div class="flex items-center gap-4">
              <span class="text-sm text-slate-400 w-24">${stat.label}</span>
              <div class="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-${stat.color}-500 rounded-full" style="width: ${stat.value}%"></div>
              </div>
              <span class="text-sm font-medium text-slate-300 w-10">${stat.value}</span>
            </div>`;
    });
    
    content += `
          </div>
          <div class="p-4 rounded-lg bg-${cls.color}-500/10 border border-${cls.color}-500/30">
            <h3 class="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-2">Playstyle</h3>
            <p class="text-sm text-slate-400">${classData.playstyle}</p>
          </div>
        </div>
      </div>`;
  });
  
  content += `</div></div></section>`;
  return content;
}

function generateSkillTreePage(t, lang) {
  const trees = [
    { key: 'defenderTree', color: 'blue', icon: 'shield' },
    { key: 'archerTree', color: 'green', icon: 'target' },
    { key: 'healerTree', color: 'yellow', icon: 'heart' }
  ];
  
  let content = `<section class="py-24 bg-slate-950 relative overflow-hidden">
    <div class="absolute inset-0 bg-cover bg-center opacity-20" style="background-image: url(/skill-tree-bg.jpg)"></div>
    <div class="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h1 class="text-4xl sm:text-5xl font-bold mb-4"><span class="gradient-text">${t.skillTree.title}</span></h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">${t.skillTree.subtitle}</p>
      </div>
      <div class="space-y-16">`;
  
  trees.forEach(tree => {
    const treeData = t.skillTree[tree.key];
    content += `
      <div class="p-8 rounded-2xl bg-${tree.color}-500/10 border-2 border-${tree.color}-500/30 backdrop-blur-sm">
        <div class="flex items-center gap-4 mb-8">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-${tree.color}-500 to-${tree.color === 'blue' ? 'cyan' : tree.color === 'green' ? 'emerald' : 'orange'}-500 flex items-center justify-center">
            <span class="text-white text-2xl">${tree.key === 'defenderTree' ? '🛡️' : tree.key === 'archerTree' ? '🏹' : '💚'}</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">${treeData.name}</h2>
            <p class="text-slate-400">${treeData.description}</p>
          </div>
        </div>
        <div class="grid md:grid-cols-3 gap-6">`;
    
    treeData.branches.forEach(branch => {
      content += `
          <div class="p-6 rounded-xl bg-slate-900/50 border border-white/10">
            <h3 class="text-lg font-bold text-${tree.color}-400 mb-2">${branch.name}</h3>
            <p class="text-sm text-slate-400 mb-4">${branch.description}</p>
            <div class="space-y-3">`;
      branch.nodes.forEach(node => {
        content += `
              <div class="flex items-start gap-3 p-3 rounded-lg bg-slate-800/50">
                <span class="text-${tree.color}-400">⭐</span>
                <div>
                  <div class="font-medium text-slate-200 text-sm">${node.name}</div>
                  <div class="text-xs text-slate-500">${node.effect}</div>
                </div>
              </div>`;
      });
      content += `</div></div>`;
    });
    
    content += `</div></div>`;
  });
  
  content += `</div>
      <div class="mt-12 p-6 rounded-xl bg-slate-900/50 border border-purple-500/30">
        <h3 class="font-semibold text-slate-200 mb-4">💡 ${t.skillTree.tips.title}</h3>
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">`;
  
  t.skillTree.tips.list.forEach(tip => {
    content += `
          <div class="flex items-start gap-2">
            <span class="text-purple-400">→</span>
            <span class="text-sm text-slate-400">${tip}</span>
          </div>`;
  });
  
  content += `</div></div></div></section>`;
  return content;
}

function generateItemsPage(t, lang) {
  let content = `<section class="py-24 bg-slate-950 relative overflow-hidden">
    <div class="absolute inset-0 bg-cover bg-center opacity-15" style="background-image: url(/items-crafting.jpg)"></div>
    <div class="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h1 class="text-4xl sm:text-5xl font-bold mb-4"><span class="gradient-text">${t.items.title}</span></h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">${t.items.subtitle}</p>
      </div>
      
      <div class="mb-16">
        <h2 class="text-2xl font-bold text-slate-200 mb-8">📦 ${t.items.combos.title}</h2>
        <div class="grid md:grid-cols-2 gap-6">`;
  
  t.items.recipes.forEach(recipe => {
    const color = recipe.name.includes('Flame') || recipe.name.includes('烈焰') ? 'red' : 
                  recipe.name.includes('Life') || recipe.name.includes('生命') ? 'green' :
                  recipe.name.includes('Thunder') || recipe.name.includes('雷霆') ? 'blue' : 'yellow';
    content += `
          <div class="p-6 rounded-2xl bg-slate-900/50 border-2 border-purple-500/30">
            <div class="p-4 rounded-xl bg-${color}-500/10 border border-white/20">
              <div class="flex items-center justify-between mb-2">
                <h3 class="text-xl font-bold text-white">${recipe.result.name}</h3>
                <span class="px-3 py-1 rounded-full text-xs font-medium ${recipe.result.rarity === 'Legendary' || recipe.result.rarity === '传说' ? 'bg-yellow-500/20 text-yellow-300' : recipe.result.rarity === 'Epic' || recipe.result.rarity === '史诗' ? 'bg-purple-500/20 text-purple-300' : 'bg-blue-500/20 text-blue-300'}">${recipe.result.rarity}</span>
              </div>
              <p class="text-sm text-slate-400 mb-3">${recipe.desc}</p>
              <div class="space-y-1">`;
    recipe.result.stats.forEach(stat => {
      content += `<div class="flex items-center gap-2 text-sm text-white/80"><span>⭐</span>${stat}</div>`;
    });
    content += `</div></div></div>`;
  });
  
  content += `</div></div>
      
      <div>
        <h2 class="text-2xl font-bold text-slate-200 mb-8">⭐ ${t.items.rare.title}</h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">`;
  
  t.items.rare.list.forEach(item => {
    const colorClass = item.rarity === 'Legendary' || item.rarity === '传说' ? 'yellow' : item.rarity === 'Epic' || item.rarity === '史诗' ? 'purple' : 'blue';
    content += `
          <div class="p-4 rounded-xl bg-${colorClass}-500/10 border border-${colorClass}-500/30 hover:scale-105 transition-transform">
            <div class="font-semibold text-${colorClass}-400 mb-1">${item.name}</div>
            <div class="text-xs text-slate-500 mb-2">${item.rarity}</div>
            <div class="text-sm text-slate-400">${item.desc}</div>
          </div>`;
  });
  
  content += `</div></div></div></section>`;
  return content;
}

function generateBossesPage(t, lang) {
  let content = `<section class="py-24 bg-slate-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h1 class="text-4xl sm:text-5xl font-bold mb-4"><span class="gradient-text">${t.bosses.title}</span></h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">${t.bosses.subtitle}</p>
      </div>
      <div class="space-y-8">`;
  
  t.bosses.list.forEach(boss => {
    const diffColor = boss.difficulty === 'Easy' || boss.difficulty === '简单' ? 'green' :
                      boss.difficulty === 'Medium' || boss.difficulty === '中等' ? 'yellow' :
                      boss.difficulty === 'Hard' || boss.difficulty === '困难' ? 'orange' :
                      boss.difficulty === 'Extreme' || boss.difficulty === '极难' ? 'purple' : 'red';
    
    content += `
      <div class="p-8 rounded-2xl bg-${diffColor}-500/10 border-2 border-${diffColor}-500/30 backdrop-blur-sm">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 rounded-lg bg-${diffColor}-500/20 flex items-center justify-center">
            <span class="text-${diffColor}-400 text-2xl">💀</span>
          </div>
          <div>
            <h2 class="text-2xl font-bold text-white">${boss.name}</h2>
            <span class="text-sm text-${diffColor}-400">${boss.difficulty}</span>
          </div>
        </div>
        
        <div class="grid lg:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div class="grid grid-cols-3 gap-4">
              <div class="p-4 rounded-lg bg-slate-900/50">
                <div class="text-slate-400 text-sm mb-1">❤️ ${t.bosses.stats.hp}</div>
                <div class="text-xl font-bold text-white">${boss.hp}</div>
              </div>
              <div class="p-4 rounded-lg bg-slate-900/50">
                <div class="text-slate-400 text-sm mb-1">⚔️ ${t.bosses.stats.attack}</div>
                <div class="text-xl font-bold text-white">${boss.attack}</div>
              </div>
              <div class="p-4 rounded-lg bg-slate-900/50">
                <div class="text-slate-400 text-sm mb-1">⚡ ${t.bosses.stats.special}</div>
                <div class="text-sm font-medium text-white">${boss.special.split(/[:：]/)[0]}</div>
              </div>
            </div>
            
            <div class="p-4 rounded-lg bg-slate-900/50 border border-white/10">
              <div class="flex items-center gap-2 text-yellow-400 mb-2">
                <span>⚠️</span>
                <span class="font-semibold">${t.bosses.stats.special}</span>
              </div>
              <p class="text-slate-300">${boss.special}</p>
            </div>
            
            <div>
              <div class="text-slate-400 text-sm mb-3">🎯 ${t.bosses.weaknesses}</div>
              <div class="flex flex-wrap gap-2">`;
    boss.weaknesses.forEach(w => {
      content += `<span class="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-sm border border-red-500/30">${w}</span>`;
    });
    content += `</div></div></div>
          
          <div class="space-y-6">
            <div>
              <h3 class="text-lg font-semibold text-slate-200 mb-4">🛡️ ${t.bosses.strategy}</h3>
              <div class="space-y-3">`;
    boss.strategy.forEach(s => {
      content += `<div class="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50"><span class="text-blue-400">→</span><span class="text-slate-300">${s}</span></div>`;
    });
    content += `</div></div>
            
            <div>
              <h3 class="text-lg font-semibold text-slate-200 mb-4">🏆 ${t.bosses.rewards}</h3>
              <div class="flex flex-wrap gap-2">`;
    boss.rewards.forEach(r => {
      content += `<span class="px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 text-sm border border-yellow-500/30">${r}</span>`;
    });
    content += `</div></div></div></div></div>`;
  });
  
  content += `</div></div></section>`;
  return content;
}

function generateGuidePage(t, lang) {
  let content = `<section class="py-24 bg-slate-950">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h1 class="text-4xl sm:text-5xl font-bold mb-4"><span class="gradient-text">${t.guide.title}</span></h1>
        <p class="text-slate-400 text-lg max-w-2xl mx-auto">${t.guide.subtitle}</p>
      </div>
      
      <div class="mb-16">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">`;
  
  const colors = ['blue', 'green', 'yellow', 'purple', 'red'];
  t.guide.steps.forEach((step, i) => {
    content += `
          <div class="p-6 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-purple-500/30 transition-colors">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-lg bg-${colors[i]}-500/20 text-${colors[i]}-400 flex items-center justify-center font-bold">${i + 1}</div>
              <h3 class="text-lg font-bold text-white">${step.title}</h3>
            </div>
            <ul class="space-y-2">`;
    step.content.forEach(c => {
      content += `<li class="flex items-start gap-2 text-sm text-slate-400"><span class="text-purple-400">⭐</span>${c}</li>`;
    });
    content += `</ul></div>`;
  });
  
  content += `</div></div>
      
      <div class="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 class="text-2xl font-bold text-slate-200 mb-6">❓ ${t.guide.faq.title}</h2>
          <div class="space-y-4">`;
  
  t.guide.faq.list.forEach(faq => {
    content += `
            <details class="group border border-slate-700 rounded-xl overflow-hidden">
              <summary class="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-900/50">
                <span class="font-medium text-slate-200">${faq.q}</span>
                <span class="text-slate-400 group-open:rotate-90 transition-transform">→</span>
              </summary>
              <div class="px-4 pb-4">
                <p class="text-slate-400 text-sm">${faq.a}</p>
              </div>
            </details>`;
  });
  
  content += `</div></div>
        
        <div>
          <h2 class="text-2xl font-bold text-slate-200 mb-6">💡 ${t.guide.tips.title}</h2>
          <div class="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
            <div class="space-y-4">`;
  
  t.guide.tips.list.forEach((tip, i) => {
    content += `
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span class="text-xs text-yellow-400 font-medium">${i + 1}</span>
                </div>
                <span class="text-slate-300">${tip}</span>
              </div>`;
  });
  
  content += `</div></div></div></div></div></section>`;
  return content;
}

// Build all pages
function build() {
  console.log('Building Tangy TD Guide...');
  
  // Copy public files
  copyPublic();
  
  // Create zh directory
  const zhDir = path.join(distDir, 'zh');
  if (!fs.existsSync(zhDir)) {
    fs.mkdirSync(zhDir, { recursive: true });
  }
  
  // ===== ENGLISH PAGES =====
  
  // Home
  fs.writeFileSync(path.join(distDir, 'index.html'), generatePage(
    `${en.site.title} | ${en.hero.title}`,
    en.site.description,
    generateHero(en, 'en') + generateClassesPreview(en, 'en'),
    'en'
  ));
  
  // Classes
  fs.writeFileSync(path.join(distDir, 'classes.html'), generatePage(
    `${en.classes.title} | ${en.site.title}`,
    en.classes.subtitle,
    generateClassesPage(en, 'en'),
    'en'
  ));
  
  // Skill Tree
  fs.writeFileSync(path.join(distDir, 'skill-tree.html'), generatePage(
    `${en.skillTree.title} | ${en.site.title}`,
    en.skillTree.subtitle,
    generateSkillTreePage(en, 'en'),
    'en'
  ));
  
  // Items
  fs.writeFileSync(path.join(distDir, 'items.html'), generatePage(
    `${en.items.title} | ${en.site.title}`,
    en.items.subtitle,
    generateItemsPage(en, 'en'),
    'en'
  ));
  
  // Bosses
  fs.writeFileSync(path.join(distDir, 'bosses.html'), generatePage(
    `${en.bosses.title} | ${en.site.title}`,
    en.bosses.subtitle,
    generateBossesPage(en, 'en'),
    'en'
  ));
  
  // Guide
  fs.writeFileSync(path.join(distDir, 'guide.html'), generatePage(
    `${en.guide.title} | ${en.site.title}`,
    en.guide.subtitle,
    generateGuidePage(en, 'en'),
    'en'
  ));
  
  // ===== CHINESE PAGES =====
  
  // Home
  fs.writeFileSync(path.join(zhDir, 'index.html'), generatePage(
    `${zh.site.title} | ${zh.hero.title}`,
    zh.site.description,
    generateHero(zh, 'zh') + generateClassesPreview(zh, 'zh'),
    'zh'
  ));
  
  // Classes
  fs.writeFileSync(path.join(zhDir, 'classes.html'), generatePage(
    `${zh.classes.title} | ${zh.site.title}`,
    zh.classes.subtitle,
    generateClassesPage(zh, 'zh'),
    'zh'
  ));
  
  // Skill Tree
  fs.writeFileSync(path.join(zhDir, 'skill-tree.html'), generatePage(
    `${zh.skillTree.title} | ${zh.site.title}`,
    zh.skillTree.subtitle,
    generateSkillTreePage(zh, 'zh'),
    'zh'
  ));
  
  // Items
  fs.writeFileSync(path.join(zhDir, 'items.html'), generatePage(
    `${zh.items.title} | ${zh.site.title}`,
    zh.items.subtitle,
    generateItemsPage(zh, 'zh'),
    'zh'
  ));
  
  // Bosses
  fs.writeFileSync(path.join(zhDir, 'bosses.html'), generatePage(
    `${zh.bosses.title} | ${zh.site.title}`,
    zh.bosses.subtitle,
    generateBossesPage(zh, 'zh'),
    'zh'
  ));
  
  // Guide
  fs.writeFileSync(path.join(zhDir, 'guide.html'), generatePage(
    `${zh.guide.title} | ${zh.site.title}`,
    zh.guide.subtitle,
    generateGuidePage(zh, 'zh'),
    'zh'
  ));
  
  console.log('Build complete!');
  console.log('Generated pages:');
  console.log('  - / (en)');
  console.log('  - /classes.html (en)');
  console.log('  - /skill-tree.html (en)');
  console.log('  - /items.html (en)');
  console.log('  - /bosses.html (en)');
  console.log('  - /guide.html (en)');
  console.log('  - /zh/ (zh)');
  console.log('  - /zh/classes.html (zh)');
  console.log('  - /zh/skill-tree.html (zh)');
  console.log('  - /zh/items.html (zh)');
  console.log('  - /zh/bosses.html (zh)');
  console.log('  - /zh/guide.html (zh)');
}

build();
