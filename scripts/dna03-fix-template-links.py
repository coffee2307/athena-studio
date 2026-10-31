from pathlib import Path
root=Path(__file__).resolve().parents[1]
files=[root/'scripts/dna03-extract-templates.py']+list((root/'templates').rglob('Site.tsx'))
for p in files:
 s=p.read_text(encoding='utf-8')
 s=s.replace('import {useState} from "react";','import {useState} from "react";\nimport Link from "next/link";')
 s=s.replace('<a ','<Link ').replace('</a>','</Link>')
 p.write_text(s,encoding='utf-8')
 print('PATCH',p.relative_to(root))
