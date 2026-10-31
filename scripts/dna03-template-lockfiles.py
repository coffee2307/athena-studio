import json
from pathlib import Path
root=Path(__file__).resolve().parents[1]
base=root/'templates/creative-studio/package-lock.json'
lock=json.loads(base.read_text(encoding='utf-8'))
count=0
for folder in sorted((root/'templates').iterdir()):
 if not (folder/'package.json').exists(): continue
 name=json.loads((folder/'package.json').read_text(encoding='utf-8'))['name']
 value=json.loads(json.dumps(lock))
 value['name']=name
 value['packages']['']['name']=name
 (folder/'package-lock.json').write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 count+=1
print('LOCKFILES',count)
