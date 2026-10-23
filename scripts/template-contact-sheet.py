from PIL import Image,ImageOps,ImageDraw
from pathlib import Path
src=Path(".qa/template-worlds")
names=["creative-studio","modern-corporate","commerce-standard","fashion-archive","saas-product","campaign-landing","hospitality-booking","editorial-journal","architecture-studio","wellness-clinic","property-showcase","education-platform"]
W,H=480,340
out=Image.new("RGB",(W*3,H*4),(245,245,245))
for i,n in enumerate(names):
 p=src/(n+"-desktop.png")
 if not p.exists(): continue
 img=Image.open(p).convert("RGB")
 img=img.resize((W,H-33))
 x,y=(i%3)*W,(i//3)*H
 out.paste(img,(x,y))
 ImageDraw.Draw(out).text((x+14,y+H-29),f"{i+1:02} / {n}",fill=(20,20,20))
out.save(src/"montage.jpg",quality=87)
print(src/"montage.jpg")
