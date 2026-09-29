param(
  [string]$OutputDirectory = '.tmp-video-tools/frames',
  [int]$FramesPerSecond = 12
)

Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @'
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;

public static class Level0TutorialRenderer {
  const int W = 1280, H = 720;
  static readonly float[] Durations = { 16.4f, 13.4f, 16.3f, 13.2f };
  static readonly string[] Titles = { "تعرّف على أجزاء القسمة", "المساعدة خطوة بخطوة", "فكّك العدد واحسب", "رحلتك تستحق المكافأة" };
  static readonly string[] Captions = {
    "اسحب أسماء الأجزاء وضع كل بطاقة أسفل الرقم الصحيح",
    "حاول مرة أخرى، ثم اتبع السهم واللون المطابق",
    "625 ÷ 5 — اسحب الأرقام أو اضغط عليها لإكمال الناتج",
    "ستظهر نتيجتك الحقيقية بعد إتمام المرحلتين"
  };
  static readonly Random Stars = new Random(27);
  static readonly PointF[] StarPoints = MakeStars();

  static PointF[] MakeStars() {
    var points = new PointF[85];
    for (int i = 0; i < points.Length; i++) points[i] = new PointF(Stars.Next(W), Stars.Next(H));
    return points;
  }
  static Color C(int r, int g, int b, int a = 255) { return Color.FromArgb(a, r, g, b); }
  static GraphicsPath Path(float x, float y, float w, float h, float radius) {
    var p = new GraphicsPath(); float d = radius * 2;
    p.AddArc(x, y, d, d, 180, 90); p.AddArc(x + w - d, y, d, d, 270, 90);
    p.AddArc(x + w - d, y + h - d, d, d, 0, 90); p.AddArc(x, y + h - d, d, d, 90, 90);
    p.CloseFigure(); return p;
  }
  static void Panel(Graphics g, float x, float y, float w, float h, float radius, Color fill, Color stroke, float sw = 2) {
    using (var path = Path(x, y, w, h, radius)) {
      using (var b = new SolidBrush(fill)) g.FillPath(b, path);
      using (var p = new Pen(stroke, sw)) g.DrawPath(p, path);
    }
  }
  static void Text(Graphics g, string value, float x, float y, float w, float h, float size, Color color, bool bold = false, StringAlignment align = StringAlignment.Center) {
    using (var font = new Font("Tahoma", size, bold ? FontStyle.Bold : FontStyle.Regular, GraphicsUnit.Pixel))
    using (var brush = new SolidBrush(color))
    using (var format = new StringFormat { Alignment = align, LineAlignment = StringAlignment.Center, FormatFlags = StringFormatFlags.DirectionRightToLeft })
      g.DrawString(value, font, brush, new RectangleF(x, y, w, h), format);
  }
  static void TextLtr(Graphics g, string value, float x, float y, float w, float h, float size, Color color, bool bold = false) {
    using (var font = new Font("Tahoma", size, bold ? FontStyle.Bold : FontStyle.Regular, GraphicsUnit.Pixel))
    using (var brush = new SolidBrush(color))
    using (var format = new StringFormat { Alignment = StringAlignment.Center, LineAlignment = StringAlignment.Center })
      g.DrawString(value, font, brush, new RectangleF(x, y, w, h), format);
  }
  static void Line(Graphics g, Color color, float width, float x1, float y1, float x2, float y2) {
    using (var p = new Pen(color, width) { StartCap = LineCap.Round, EndCap = LineCap.Round }) g.DrawLine(p, x1, y1, x2, y2);
  }
  static void Base(Graphics g, int scene, float time) {
    using (var b = new LinearGradientBrush(new Point(0, 0), new Point(W, H), C(7, 17, 47), C(21, 13, 58))) g.FillRectangle(b, 0, 0, W, H);
    using (var b = new SolidBrush(C(60, 113, 230, 32))) g.FillEllipse(b, -150, -230, 650, 650);
    using (var b = new SolidBrush(C(91, 44, 183, 28))) g.FillEllipse(b, 930, 360, 540, 540);
    for (int i = 0; i < StarPoints.Length; i++) {
      float alpha = 75 + (float)(50 * (1 + Math.Sin(time * 2 + i)) / 2);
      using (var b = new SolidBrush(C(207, 235, 255, (int)alpha))) g.FillEllipse(b, StarPoints[i].X, StarPoints[i].Y, i % 9 == 0 ? 3 : 2, i % 9 == 0 ? 3 : 2);
    }
    Panel(g, 48, 36, 1184, 648, 34, C(7, 25, 61, 236), C(89, 149, 224, 110), 2);
    Panel(g, 70, 57, 1140, 56, 16, C(22, 48, 92), C(90, 166, 238, 60), 1);
    Text(g, "المستوى التمهيدي • دليل الرحلة", 790, 65, 390, 38, 22, C(218, 238, 255), true);
    Text(g, "SPACE DIVISION  /  0" + (scene + 1), 91, 68, 310, 34, 15, C(109, 222, 249), true, StringAlignment.Near);
    Text(g, Titles[scene], 170, 123, 940, 58, 40, Color.White, true);
    for (int i = 0; i < 4; i++) Panel(g, 547 + i * 48, 638, 36, 8, 4, i == scene ? C(92, 239, 255) : C(75, 101, 145), Color.Transparent, 0);
    Text(g, Captions[scene], 156, 650, 968, 27, 18, C(172, 221, 245), true);
  }
  static void Number(Graphics g, string n, float x, float y, bool green = false, bool dim = false) {
    Panel(g, x, y, 82, 49, 11, green ? C(70, 226, 111) : dim ? C(79, 89, 119) : C(40, 123, 198), green ? C(170, 255, 189) : C(135, 217, 255), 2);
    Text(g, n, x, y + 1, 82, 46, 26, green ? C(5, 48, 22) : Color.White, true);
  }
  static void Target(Graphics g, float x, float y, float w, string label = "ضع البطاقة هنا", bool green = false) {
    using (var p = Path(x, y, w, 42, 8)) {
      using (var b = new SolidBrush(green ? C(23, 99, 66, 235) : C(12, 42, 81, 235))) g.FillPath(b, p);
      using (var pen = new Pen(green ? C(106, 245, 139) : C(85, 180, 240), 1.5f) { DashStyle = DashStyle.Dash }) g.DrawPath(pen, p);
    }
    Text(g, label, x + 3, y + 2, w - 6, 38, 14, green ? C(155, 255, 177) : C(156, 205, 238), green);
  }
  static void Card(Graphics g, string label, float x, float y, bool green = false, bool dim = false) {
    Panel(g, x, y, 166, 46, 11, green ? C(66, 228, 104) : dim ? C(61, 74, 103) : C(35, 102, 170), green ? C(160, 255, 175) : C(122, 201, 255), 1.5f);
    Text(g, label, x + 4, y + 2, 158, 42, 18, green ? C(5, 49, 23) : Color.White, true);
  }
  static void Pointer(Graphics g, float x, float y) {
    using (var b = new SolidBrush(C(253, 222, 158))) {
      PointF[] points = { new PointF(x, y), new PointF(x + 4, y + 25), new PointF(x + 12, y + 17), new PointF(x + 20, y + 35), new PointF(x + 26, y + 30), new PointF(x + 18, y + 13), new PointF(x + 29, y + 15) };
      g.FillPolygon(b, points);
    }
    using (var p = new Pen(C(85, 50, 40), 2)) g.DrawEllipse(p, x + 7, y + 26, 16, 10);
  }
  static void Model(Graphics g, bool hint, float time, bool wrong = false) {
    Panel(g, 330, 278, 620, 278, 20, C(19, 55, 98, 195), C(104, 216, 253), 3);
    Text(g, "نموذج مساحة المستطيل", 440, 252, 400, 24, 16, C(129, 230, 255), true);
    bool green = hint && time > 9;
    Number(g, "375", 400, 315, false, green); Target(g, 385, 371, 112, green ? "" : "اسحب هنا");
    Number(g, "5", 190, 395, false, green); Target(g, 175, 451, 112, green ? "" : "اسحب هنا");
    Number(g, "75", 792, 172, green, false); Target(g, 777, 230, 112, green ? "ناتج القسمة" : "اسحب هنا", green);
    Number(g, "0", 798, 430, false, green); Target(g, 783, 487, 112, green ? "" : "اسحب هنا");
    if (hint && time > 5 && time <= 9) {
      Line(g, C(255, 229, 87), 7, 1040, 300, 880, 250);
      Text(g, "➜", 867, 218, 70, 60, 52, C(255, 226, 72), true);
    }
  }
  static void SceneOne(Graphics g, float t) {
    Model(g, false, t);
    string[] labels = { "المقسوم", "المقسوم عليه", "ناتج القسمة", "الباقي" };
    for (int i = 0; i < 4; i++) Card(g, labels[i], 266 + i * 188, 578);
    if (t >= 3 && t < 11) {
      float u = Math.Max(0, Math.Min(1, (t - 4) / 4));
      float x = 266 + (385 - 266) * u, y = 578 + (371 - 578) * u;
      Card(g, "المقسوم", x, y, u > .85f); Pointer(g, x + 102, y + 15);
    }
    if (t >= 11) Target(g, 385, 371, 112, "المقسوم", true);
  }
  static void SceneTwo(Graphics g, float t) {
    Model(g, true, t);
    bool green = t > 9;
    string[] labels = { "المقسوم", "المقسوم عليه", "ناتج القسمة", "الباقي" };
    for (int i = 0; i < 4; i++) Card(g, labels[i], 266 + i * 188, 578, green && i == 2, green && i != 2);
    if (t < 5) {
      Panel(g, 473, 185, 300, 57, 14, C(105, 35, 62, 240), C(255, 110, 131), 2);
      Text(g, "حاول مرة أخرى!", 480, 190, 286, 48, 26, Color.White, true);
    } else if (t <= 9) {
      Panel(g, 95, 180, 300, 58, 13, C(65, 54, 24, 230), C(248, 211, 84), 2);
      Text(g, "اتبع السهم إلى المكان الصحيح", 102, 186, 286, 44, 18, C(255, 239, 153), true);
    } else {
      Panel(g, 106, 170, 300, 60, 13, C(23, 89, 56, 230), C(104, 238, 139), 2);
      Text(g, "اللون الأخضر يربط البطاقة برقمها", 113, 176, 286, 47, 17, C(192, 255, 204), true);
    }
  }
  static void SceneThree(Graphics g, float t) {
    TextLtr(g, "625  ÷  5  =  ?", 429, 177, 440, 58, 39, C(142, 238, 255), true);
    Panel(g, 145, 260, 754, 252, 19, C(20, 58, 104), C(111, 216, 255), 3);
    Panel(g, 166, 282, 470, 207, 8, C(37, 91, 138), C(105, 183, 229), 1);
    Panel(g, 641, 282, 237, 207, 8, C(62, 67, 117), C(138, 151, 236), 1);
    Text(g, "500", 252, 321, 300, 59, 47, Color.White, true);
    Text(g, "125", 653, 321, 210, 59, 47, Color.White, true);
    TextLtr(g, "500 ÷ 5 = 100", 240, 419, 320, 43, 27, C(127, 244, 190), true);
    TextLtr(g, "125 ÷ 5 = 25", 649, 419, 220, 43, 27, C(153, 227, 255), true);
    Panel(g, 957, 205, 228, 340, 17, C(14, 41, 85), C(109, 187, 242), 2);
    Text(g, "لوحة الأرقام", 983, 219, 177, 29, 20, C(170, 232, 255), true);
    for (int i = 0; i < 10; i++) {
      float x = 982 + (i % 3) * 62, y = 261 + (i / 3) * 64;
      Panel(g, x, y, 50, 48, 9, i == 5 && t > 5 ? C(64, 217, 107) : C(37, 111, 185), C(126, 202, 252), 1);
      Text(g, i.ToString(), x, y, 50, 48, 25, Color.White, true);
    }
    Panel(g, 459, 550, 370, 54, 14, C(16, 90, 70), C(101, 230, 153), 2);
    if (t > 9) TextLtr(g, "100 + 25 = 125 ✓", 465, 556, 358, 43, 27, C(183, 255, 211), true);
    else Text(g, "الناتج الجزئي:  ___  +  ___", 465, 556, 358, 43, 27, C(183, 255, 211), true);
    if (t > 4 && t < 10) Pointer(g, 1050 - (t - 4) * 68, 390 + (t - 4) * 25);
  }
  static void SceneFour(Graphics g, float t) {
    float pulse = (float)Math.Sin(t * 2.5f) * 5;
    Text(g, "★", 489, 188 - pulse, 300, 155, 120, C(255, 223, 90), true);
    Text(g, "أحسنت يا بطل!", 396, 335, 488, 63, 43, Color.White, true);
    string[] items = { "الوقت المستغرق", "المحاولات والأخطاء", "نجمة التميز", "لقب المستكشف" };
    for (int i = 0; i < 4; i++) {
      float x = 177 + i * 237;
      Panel(g, x, 440, 214, 91, 15, C(25, 56, 105), C(96, 178, 238), 2);
      Text(g, items[i], x + 7, 450, 200, 72, 19, C(221, 243, 255), true);
    }
    Panel(g, 422, 563, 436, 52, 15, C(54, 200, 91), C(154, 255, 171), 2);
    Text(g, "يُفتح المستوى الأول على خريطة الكواكب", 435, 568, 410, 41, 21, C(4, 51, 23), true);
    if (t > 5) for (int i = 0; i < 18; i++) {
      float x = 130 + (i * 179 % 1020), y = 180 + (i * 97 % 390) + (t - 5) * (i % 3 + 2) * 5;
      using (var b = new SolidBrush(i % 2 == 0 ? C(112, 235, 255) : C(255, 222, 99))) g.FillEllipse(b, x, y, 5, 5);
    }
  }
  public static void Render(string directory, int fps) {
    Directory.CreateDirectory(directory);
    int frame = 0;
    for (int scene = 0; scene < 4; scene++) {
      int count = (int)Math.Round(Durations[scene] * fps);
      for (int i = 0; i < count; i++) {
        float local = (float)i / fps;
        using (var image = new Bitmap(W, H))
        using (var g = Graphics.FromImage(image)) {
          g.SmoothingMode = SmoothingMode.AntiAlias;
          g.TextRenderingHint = System.Drawing.Text.TextRenderingHint.AntiAliasGridFit;
          Base(g, scene, local);
          if (scene == 0) SceneOne(g, local);
          else if (scene == 1) SceneTwo(g, local);
          else if (scene == 2) SceneThree(g, local);
          else SceneFour(g, local);
          float fade = Math.Min(1, Math.Min(local / .35f, (Durations[scene] - local) / .35f));
          if (fade < 1) using (var b = new SolidBrush(Color.FromArgb((int)(255 * (1 - Math.Max(0, fade))), 4, 10, 31))) g.FillRectangle(b, 0, 0, W, H);
          image.Save(System.IO.Path.Combine(directory, string.Format("frame-{0:D4}.png", frame++)), ImageFormat.Png);
        }
      }
    }
    Console.WriteLine("Rendered " + frame + " frames");
  }
}
'@

[Level0TutorialRenderer]::Render($OutputDirectory, $FramesPerSecond)
