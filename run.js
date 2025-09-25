(async function () {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  function waitForNewCards(timeout = 5000) {
    return new Promise((resolve, reject) => {
      const container = document.querySelector(
        "._bg-skylight_mkn5w_11.col-md-12"
      ); // یا والد کارت‌ها
      if (!container) return reject("Container not found");

      const observer = new MutationObserver((mutations) => {
        if (container.querySelectorAll(".product-card").length > 0) {
          observer.disconnect();
          resolve();
        }
      });

      observer.observe(container, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        reject("Timeout waiting for new cards");
      }, timeout);
    });
  }
  // --- تبدیل قیمت ---
  function parsePrice(text) {
    const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
    const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

    let result = text
      .replace(/[^\d۰-۹٠-٩]/g, "")
      .split("")
      .map((ch) => {
        if (persianDigits.indexOf(ch) !== -1) return persianDigits.indexOf(ch);
        if (arabicDigits.indexOf(ch) !== -1) return arabicDigits.indexOf(ch);
        return ch;
      })
      .join("");

    return parseInt(result, 10);
  }

  // --- فرمت نام کتاب ---
  function formatName(text) {
    if (!text) return "";
    text = text.replace(/^کتاب\s+/, ""); // حذف کتاب
    text = text.split("|")[0]; // حذف بعد از |
    return text.trim().toLowerCase();
  }

  // --- normalize و Levenshtein ---
  function normalizeText(text) {
    return text
      .toLowerCase()
      .replace(/[\s\-\u200C]/g, "")
      .replace(/‌/g, "")
      .replace(/[^\w\u0600-\u06FF]/g, "");
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
          d[i - 1][j] + 1,
          d[i][j - 1] + 1,
          d[i - 1][j - 1] + cost
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

  // --- حلقه اصلی ---
  for (let i = 0; i < 10; i++) {
    console.log(`--- Run #${i + 1} ---`);
    await sleep(200);

    // قیمت و اسم مرجع
    const priceEl = document.querySelector(".container ._priceTag_1ehir_1");
    const nameEl = document.querySelector(".container ._highlightHint_1vigz_1");
    if (!priceEl || !nameEl) {
      console.log("مرجع پیدا نشد!");
      continue;
    }

    const referencePrice = parsePrice(priceEl.innerText);
    let referenceName = formatName(nameEl.innerText);
    console.log(
      "referencePrice:",
      referencePrice,
      "referenceName:",
      referenceName
    );

    await sleep(200);

    const cards = document.querySelectorAll(".product-card");
    let foundMatch = false;

    for (const card of cards) {
      const cardPriceEl = card.querySelector("._priceTag_1ehir_1");
      const titleEl = card.querySelector("._titleText_18kyo_27");
      if (!cardPriceEl || !titleEl) continue;

      const cardPrice = parsePrice(cardPriceEl.innerText);
      const title = titleEl.innerText.replace(/\s+/g, " ").trim();

      if (cardPrice > referencePrice && compareName(referenceName, title)) {
        const svg = card.querySelector('svg[class="_action_u7gc7_1"]');
        if (svg) {
          svg.dispatchEvent(
            new MouseEvent("click", {
              bubbles: true,
              cancelable: true,
              view: window,
            })
          );
          console.log("Clicked SVG for:", title, "Price:", cardPrice);
          foundMatch = true;
        }
      }
    }

    // اگر کارت مطابق پیدا نشد، دکمه بعدی را بزن
    if (!foundMatch) {
      const nextButton = Array.from(
        document.querySelectorAll("button._outline-blue_mkn5w_27")
      ).find((btn) => {
        const poly = btn.querySelector("polyline");
        return poly && poly.getAttribute("points") === "15 18 9 12 15 6";
      });
      if (nextButton) {
        nextButton.click();
        console.log("Next button clicked!");
      } else {
        console.log("Next button not found.");
      }
    }

    await sleep(200);

    // merge button
    const mergeBtn = document.querySelector(
      "._mergeButton_341b9_21 ._bg-blue_mkn5w_1"
    );
    if (mergeBtn) {
      mergeBtn.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      console.log("Clicked mergeBtn");
    }

    await sleep(200);

    // left side button
    const btn = document.querySelector("._leftSideButton_1c52z_11");
    if (btn) {
      btn.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
      console.log("Clicked left side btn");
    }

    console.log("Waiting 5 seconds before next run...");
    await waitForNewCards();
  }
})();
