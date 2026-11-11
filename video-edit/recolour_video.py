import sys,json,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'video-tools'))
import cv2,numpy as np
from PIL import Image
OUT=Path(__file__).parent
SOURCE=Path(r'D:\WHISKEY\Академия_Виски_№2_9_8_24_20261031T152920Z_1_001 (2)\Академия Виски №2 9.8.24\Camera_flying_around_barrels_c715215f.mp4')
FFMPEG=next((ROOT/'video-tools/imageio_ffmpeg/binaries').glob('*.exe'))
cap=cv2.VideoCapture(str(SOURCE));frames=[]
while True:
 ok,f=cap.read()
 if not ok:break
 frames.append(f)
ref=frames[-1]; h,w=ref.shape[:2]
gray=cv2.cvtColor(ref,cv2.COLOR_BGR2GRAY)
allowed=np.zeros((h,w),np.uint8)
cv2.fillPoly(allowed,[np.array([(569,271),(630,242),(696,270),(665,285),(608,285),(579,277),(579,304),(570,304)])],255)
cv2.polylines(allowed,[np.array([(608,283),(603,309),(600,332),(603,349),(611,360),(619,365),(609,382),(610,387),(651,387),(652,383),(643,365),(653,357),(658,344),(656,323),(650,285)])],False,255,7,cv2.LINE_AA)
for x1,x2,y1,y2 in [(476,548,408,465),(554,603,408,465),(612,633,408,465),(637,681,408,465),(687,735,408,465),(733,779,408,465),(521,545,477,501),(549,574,477,501),(582,604,477,501),(610,636,477,501),(644,664,477,501),(675,706,477,501),(712,737,477,501)]:
 allowed[y1:y2,x1:x2]=255
dark=np.clip((108-gray.astype(float))/30,0,1)
mask=dark*(allowed/255)
# Keep small wood-grain specks out of the paint mask.
n,labels,stats,_=cv2.connectedComponentsWithStats((mask>.25).astype(np.uint8))
for k in range(1,n):
 x,y,cw,ch,area=stats[k]
 if area<7 or (ch>cw*9):mask[labels==k]=0
mask=cv2.GaussianBlur(mask.astype(np.float32),(3,3),.45)
liquid=np.zeros((h,w),np.uint8)
cv2.fillPoly(liquid,[np.array([(605,328),(652,328),(652,341),(648,350),(640,357),(628,360),(618,357),(610,350),(606,340)])],255)
liquid=cv2.GaussianBlur(liquid.astype(np.float32)/255,(3,3),.6)
cv2.imwrite(str(OUT/'logo-mask.png'),(mask*255).astype(np.uint8))
sift=cv2.SIFT_create(nfeatures=5000,contrastThreshold=.015)
feature_region=np.zeros_like(gray);feature_region[50:670,340:970]=255;feature_region[230:510,460:790]=0
kp0,d0=sift.detectAndCompute(gray,feature_region)
matcher=cv2.BFMatcher()
def transform(frame):
 k,d=sift.detectAndCompute(cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY),None)
 pairs=matcher.knnMatch(d0,d,k=2)
 good=[a for a,b in pairs if a.distance<.72*b.distance]
 if len(good)<12:return None,0
 src=np.float32([kp0[m.queryIdx].pt for m in good]);dst=np.float32([k[m.trainIdx].pt for m in good])
 H,inliers=cv2.findHomography(src,dst,cv2.RANSAC,2.2)
 return H,int(inliers.sum()) if inliers is not None else 0
writer=cv2.VideoWriter(str(OUT/'corrected-silent.mp4'),cv2.VideoWriter_fourcc(*'mp4v'),24,(w,h))
log=[];lastH=np.eye(3)
for i,frame in enumerate(frames):
 result=frame
 if i>=150:
  H,count=transform(frame)
  if H is None:H=lastH
  lastH=H
  # The source logo materialises during the camera move; reveal paint with it.
  strength=np.clip((i-150)/18,0,1)
  wm=cv2.warpPerspective(mask,H,(w,h))*strength
  lm=cv2.warpPerspective(liquid,H,(w,h))*strength
  # The red foreground ribbon must occlude the correction, including its dark print.
  source_hsv=cv2.cvtColor(frame,cv2.COLOR_BGR2HSV)
  red=(((source_hsv[...,0]<7)|(source_hsv[...,0]>173))&(source_hsv[...,1]>150)&(source_hsv[...,2]>75)).astype(np.uint8)
  red[:,570:]=0
  red=cv2.morphologyEx(red,cv2.MORPH_CLOSE,np.ones((15,15),np.uint8))
  rn,rl,rs,_=cv2.connectedComponentsWithStats(red)
  for rk in range(1,rn):
   if rs[rk,cv2.CC_STAT_AREA]<5000:red[rl==rk]=0
  contours,_=cv2.findContours(red,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
  cv2.drawContours(red,contours,-1,1,cv2.FILLED)
  red=cv2.dilate(red,np.ones((5,5),np.uint8))
  wm*=1-red
  lm*=1-red
  f=frame.astype(np.float32)
  # White paint retains a little of the original stroke texture and lighting.
  luminance=cv2.cvtColor(frame,cv2.COLOR_BGR2GRAY).astype(np.float32)
  value=np.clip(233+(luminance-60)*.16,218,250)
  white=np.stack([value,value,value],axis=-1)
  f=f*(1-wm[...,None])+white*wm[...,None]
  hsv=cv2.cvtColor(frame,cv2.COLOR_BGR2HSV).astype(np.float32)
  hsv[...,0]=15;hsv[...,1]=215;hsv[...,2]=np.clip(hsv[...,2]*1.2+26,0,255)
  amber=cv2.cvtColor(hsv.astype(np.uint8),cv2.COLOR_HSV2BGR).astype(np.float32)
  f=f*(1-lm[...,None])+amber*lm[...,None]
  result=np.clip(f,0,255).astype(np.uint8)
  log.append({'frame':i,'matches':count})
 if i in [168,192,216,239]:cv2.imwrite(str(OUT/f'corrected-{i}.png'),result)
 writer.write(result)
writer.release()
(OUT/'tracking.json').write_text(json.dumps(log,indent=2))
subprocess.run([str(FFMPEG),'-y','-hide_banner','-loglevel','error','-i',str(OUT/'corrected-silent.mp4'),'-i',str(SOURCE),'-map','0:v:0','-map','1:a:0','-c:v','libx264','-crf','17','-preset','medium','-pix_fmt','yuv420p','-c:a','copy','-movflags','+faststart',str(OUT/'WHISKY-ACADEMY-white-logo-amber-v2.mp4')],check=True)
print('tracking min inliers',min(x['matches'] for x in log),'frames',len(frames))
