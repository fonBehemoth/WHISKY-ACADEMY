import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'video-tools'))
import cv2
from PIL import Image
p=Path(r'D:\WHISKEY\Академия_Виски_№2_9_8_24_20261031T152920Z_1_001 (2)\Академия Виски №2 9.8.24\Camera_flying_around_barrels_c715215f.mp4')
cap=cv2.VideoCapture(str(p))
print('frames',cap.get(cv2.CAP_PROP_FRAME_COUNT),'fps',cap.get(cv2.CAP_PROP_FPS))
frames=[]
while True:
 ok,f=cap.read()
 if not ok:break
 frames.append(f)
cv2.imwrite(str(Path(__file__).parent/'reference.png'),frames[-1])
Image.fromarray(cv2.cvtColor(frames[-1][235:510,465:790],cv2.COLOR_BGR2RGB)).resize((650,550)).save(Path(__file__).parent/'logo-detail.png')
for t in [6,6.5,7,8,9]:cv2.imwrite(str(Path(__file__).parent/f'frame-{t}.jpg'),frames[int(t*24)])
