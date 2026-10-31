from pathlib import Path
root=Path(__file__).resolve().parents[1]
old='section as "work"|"services"|"about"|"contact"/>'
new='section as "work"|"services"|"about"|"contact"}/>'
files=[root/'scripts/dna03-extract-templates.py']+[p for p in (root/'templates').glob('*/src/app/[[]section[]]/page.tsx')]
if len(files)==1: files=[root/'scripts/dna03-extract-templates.py']+list((root/'templates').rglob('page.tsx'))
count=0
for p in files:
 s=p.read_text(encoding='utf-8')
 if old in s:
  p.write_text(s.replace(old,new),encoding='utf-8')
  count+=1
print('PATCHED',count)
