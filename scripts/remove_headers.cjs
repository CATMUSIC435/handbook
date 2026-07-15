const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/catmu/Downloads/motion/fenica-app/src/components';
const sections = fs.readdirSync(dir).filter(f => f.startsWith('Section') && fs.statSync(path.join(dir, f)).isDirectory());

sections.forEach(section => {
  const file = path.join(dir, section, 'index.jsx');
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  
  // This regex matches <h2...>...</h2> followed by <p...text-slate-500...>...</p>
  const regex = /(<h2[^>]*\b(text-xl|text-lg|text-2xl|text-3xl)\b[^>]*font-bold[^>]*>[\s\S]*?<\/h2>\s*<p[^>]*text-slate-500[^>]*>[\s\S]*?<\/p>)/g;
  
  let newContent = content.replace(regex, '{/* $1 */}');
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log('Updated: ' + section);
  }
});
