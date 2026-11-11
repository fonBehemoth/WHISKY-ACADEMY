Add-Type -AssemblyName System.Drawing
$out = Join-Path $PSScriptRoot 'sketches'
New-Item -ItemType Directory -Force -Path $out | Out-Null
$photos = @(Get-ChildItem -LiteralPath 'D:\WHISKEY' -Recurse -Filter '*.jpg')
function Photo($name,$x,$y,$w,$h) {
  $p = $photos | Where-Object Name -eq $name | Select-Object -First 1
  $im = [System.Drawing.Image]::FromFile($p.FullName)
  $scale=[math]::Max($w/$im.Width,$h/$im.Height)
  $sw=$w/$scale; $sh=$h/$scale
  $src=New-Object System.Drawing.RectangleF ([single](($im.Width-$sw)/2)),([single](($im.Height-$sh)/2)),([single]$sw),([single]$sh)
  $dst=New-Object System.Drawing.RectangleF $x,$y,$w,$h
  $g.DrawImage($im,$dst,$src,[System.Drawing.GraphicsUnit]::Pixel)
  $im.Dispose()
}
function Fill($color,$x,$y,$w,$h) { $br=New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($color)); $g.FillRectangle($br,$x,$y,$w,$h); $br.Dispose() }
function Lines($x,$y,$w,$n) { for($j=0;$j -lt $n;$j++){ $ww=$w; if($j -eq ($n-1)){$ww=$w*.7}; Fill '#5B5750' $x ($y+$j*14) $ww 3 } }
function Title($x,$y,$w) { Fill '#C4A665' $x $y 54 3; Fill '#E6DFD2' $x ($y+24) $w 13; Fill '#E6DFD2' $x ($y+48) ($w*.78) 13 }
for($v=1;$v -le 3;$v++) {
  $bmp=New-Object System.Drawing.Bitmap 900,1500
  $g=[System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode=[System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.Clear([System.Drawing.ColorTranslator]::FromHtml('#10110F'))
  if($v -eq 1){
    Photo 'IMG_7426_1.jpg' 0 0 900 650
    $shade=New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(130,10,12,10)); $g.FillRectangle($shade,0,0,900,650);$shade.Dispose()
    Title 280 240 340; Lines 320 340 260 3; Fill '#C4A665' 355 420 190 42
    Photo 'IMG_7432_1.jpg' 75 740 350 290; Title 490 780 270; Lines 490 875 290 5
    Fill '#C4A665' 422 1100 56 3
    Photo 'IMG_7336_1.jpg' 75 1160 230 230; Photo 'IMG_7363_1.jpg' 335 1160 230 230; Photo 'IMG_7350_1.jpg' 595 1160 230 230
  }
  if($v -eq 2){
    Photo 'IMG_7432_1.jpg' 360 100 540 620
    Fill '#171815' 0 100 360 620
    Title 55 260 260; Lines 55 365 240 4; Fill '#C4A665' 55 465 180 42
    Photo 'IMG_7363_1.jpg' 75 815 300 260; Title 440 850 330; Lines 440 950 330 5
    Photo 'IMG_7426_1.jpg' 0 1160 900 340
    $shade=New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(140,10,12,10));$g.FillRectangle($shade,0,1160,900,340);$shade.Dispose()
    Title 280 1250 340; Fill '#C4A665' 355 1380 190 40
  }
  if($v -eq 3){
    Photo 'IMG_7331_1.jpg' 320 100 505 560
    Fill '#171815' 55 220 410 300; Title 90 260 320; Lines 90 355 270 3; Fill '#C4A665' 90 435 180 38
    Photo 'IMG_7432_1.jpg' 75 760 470 340; Title 600 810 215; Lines 600 910 210 5
    Photo 'IMG_7426_1.jpg' 75 1190 300 230; Photo 'IMG_7363_1.jpg' 405 1190 180 230; Photo 'IMG_7338_1.jpg' 615 1190 210 230
  }
  Fill '#10110F' 0 0 900 85
  Fill '#DDD4BF' 55 35 130 12
  Fill '#8A8270' 490 39 55 3; Fill '#8A8270' 575 39 55 3; Fill '#8A8270' 660 39 55 3
  $font=New-Object System.Drawing.Font 'Arial',10
  $g.DrawString('EN / DE',$font,[System.Drawing.Brushes]::AntiqueWhite,760,30)
  $bmp.Save((Join-Path $out "variant-$v.png"))
  $font.Dispose();$g.Dispose();$bmp.Dispose()
}
