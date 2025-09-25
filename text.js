function formatName(text) {
  if (!text) return "";

  // حذف "کتاب " از ابتدا
  text = text.replace(/^کتاب\s+/, "");

  // حذف | و بعدش
  text = text.split("|")[0];

  // پاک کردن فاصله اضافی
  return text.trim();
}

// تابع مقایسه نام
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[\s\-\u200C]/g, "") // حذف فاصله، نیم فاصله، خط تیره
    .replace(/‌/g, "") // حذف نیم فاصله
    .replace(/[^\w\u0600-\u06FF]/g, ""); // فقط حروف فارسی و لاتین
}
function levenshtein(a, b) {
  const m = a.length,
    n = b.length;
  const d = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) d[i][0] = i;
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // حذف
        d[i][j - 1] + 1, // درج
        d[i - 1][j - 1] + cost // جایگزینی
      );
    }
  }

  return d[m][n];
}
function compareName(referenceName, targetName, threshold = 80) {
  if (!referenceName || !targetName) return false;

  const ref = normalizeText(referenceName);
  const target = normalizeText(targetName);
  if (target.includes(ref)) return true;
  const distance = levenshtein(ref, target);
  const maxLen = Math.max(ref.length, target.length);
  const similarity = ((maxLen - distance) / maxLen) * 100;

  return similarity >= threshold;
}
const formated = formatName(
  "کتاب مجموعه مانگا 8 SPY X Family | انتشارات آی آی کتاب"
);

console.log();
console.log(
  compareName(
    formated,
    "کتاب خانواده جاسوس ایکس 7 Spy x family (مانگا) نشر آی آی کتاب"
  )
);
