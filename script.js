document.querySelectorAll("svg._action_u7gc7_1").forEach((el) => {
  if (el.classList.length === 1 && el.classList.contains("_action_u7gc7_1")) {
    console.log(el);
    if (typeof el.click === "function") el.click();
    el.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      })
    );
  }
});

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
}

const btn = document.querySelector("._leftSideButton_1c52z_11");
if (btn) {
  btn.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );
}

//======================================

document.querySelectorAll(".product-card").forEach((card) => {
  const priceEl = card.querySelector("._priceTag_1ehir_1");
  if (!priceEl) return;

  const priceText = parsePrice(priceEl.innerText);
  const price = parseInt(priceText, 10);

  if (price > myPrice) {
    const svg = card.querySelector('svg[class="_action_u7gc7_1"]');
    if (svg) {
      svg.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );
    }
  }
});

function parsePrice(text) {
  // تبدیل اعداد فارسی/عربی به لاتین
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

  let result = text
    .replace(/[^\d۰-۹٠-٩]/g, "") // حذف کاراکترهای غیرعددی (مثل تومان و کاما)
    .split("")
    .map((ch) => {
      if (persianDigits.indexOf(ch) !== -1) {
        return persianDigits.indexOf(ch);
      } else if (arabicDigits.indexOf(ch) !== -1) {
        return arabicDigits.indexOf(ch);
      }
      return ch; // اگر خودش لاتین بود
    })
    .join("");

  return parseInt(result, 10);
}

let price = document.querySelector(".container ._priceTag_1ehir_1").innerText;
let myPrice = parsePrice(price);

//============

function formatName(text) {
  if (!text) return "";

  // حذف "کتاب " از ابتدا
  text = text.replace(/^کتاب\s+/, "");

  // حذف | و بعدش
  text = text.split("|")[0];

  // پاک کردن فاصله اضافی
  return text.trim();
}

function compareName(referenceName, targetName) {
  if (!referenceName || !targetName) return false;

  // حذف فاصله‌های اضافی و trim
  const ref = referenceName.replace(/\s+/g, " ").trim();
  const target = targetName.replace(/\s+/g, " ").trim();

  return target.includes(ref);
}
compareName("واژه های بازیگوش", "کتاب واژه های بازیگوش اثر احمد اکبر پور");
