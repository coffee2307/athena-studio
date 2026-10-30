import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'tsconfig.json'
a=json.loads(p.read_text(encoding='utf-8'))
for item in ['templates','.dna02','.qa-product-lab','.local-recovery']:
 if item not in a['exclude']: a['exclude'].append(item)
p.write_text(json.dumps(a,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
p=root/'eslint.config.js'
s=p.read_text(encoding='utf-8')
needle='"vendor/digital-creators/**"'
if '"templates/**"' not in s:
 if needle not in s: raise RuntimeError('eslint ignore anchor missing')
 s=s.replace(needle,needle+', "templates/**", ".dna02/**", ".qa-product-lab/**"')
p.write_text(s,encoding='utf-8')
print('ROOT_PROJECT_BOUNDARIES_UPDATED')
