$code = @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public class ImageProcessor {
    public static void CreateSquareIcon(string srcPath, string destPath, int size, int padding) {
        using (Image src = Image.FromFile(srcPath)) {
            using (Bitmap bmp = new Bitmap(size, size)) {
                using (Graphics g = Graphics.FromImage(bmp)) {
                    g.SmoothingMode = SmoothingMode.AntiAlias;
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    g.Clear(Color.White);

                    int availableSize = size - (padding * 2);
                    float ratio = Math.Min((float)availableSize / src.Width, (float)availableSize / src.Height);
                    int newW = (int)(src.Width * ratio);
                    int newH = (int)(src.Height * ratio);
                    int x = (size - newW) / 2;
                    int y = (size - newH) / 2;

                    g.DrawImage(src, x, y, newW, newH);
                }
                bmp.Save(destPath, ImageFormat.Png);
            }
        }
    }
}
"@
Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing
[ImageProcessor]::CreateSquareIcon("C:\Users\catmu\Downloads\motion\fenica-app\public\favicon-dxmd-vietnam.png", "C:\Users\catmu\Downloads\motion\fenica-app\public\pwa-192x192.png", 192, 16)
[ImageProcessor]::CreateSquareIcon("C:\Users\catmu\Downloads\motion\fenica-app\public\favicon-dxmd-vietnam.png", "C:\Users\catmu\Downloads\motion\fenica-app\public\pwa-512x512.png", 512, 48)
Write-Host "Icons generated successfully!"
