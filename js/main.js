$(document).ready(function () {
  // Go to TOP
  $(".go-top").on("click", function (e) {
    e.preventDefault();
    $("html,body").animate({ scrollTop: 0 }, 700);
  });
  // 顯示 go-top 按鈕
  $(window).on("scroll", function () {
    const scrollTop = $(window).scrollTop();

    if (scrollTop > 300) {
      $(".go-top").addClass("show");
    } else {
      $(".go-top").removeClass("show");
    }
  });

  // 修正錨點位置
  $(".navigation a").on("click", function (e) {
    e.preventDefault();
    const anchor = $(this).attr("href");
    const navHeight = $(".nav-bar").outerHeight();

    const offsetTop = $(anchor).offset().top - navHeight;
    console.log("nav高度:", navHeight);
    console.log("錨點位置:", $(anchor).offset().top);

    gsap.to(window, {
      scrollTo: offsetTop,
      duration: 1.2,
      ease: "power2.out",
      // ease: 'elastic.out(0.6, 0.5)'
    });
  });

  // =========================
  // Mode 切換
  // =========================

  // Mode 切換 + ICON 切換
  const $body = $(".one-page-light");
  const $icons = document.querySelectorAll(".img-2");
  const savedMode = localStorage.getItem("bagel-mode") || "light";

  // 頁面載入時初始化主題和圖示
  $body.attr("data-collection-mode", savedMode);
  $icons.forEach((icon) => {
    const initialSrc =
      savedMode === "dark" ? icon.dataset.dark : icon.dataset.light;
    icon.setAttribute("src", initialSrc);
  });

  // 點擊切換主題與 icon
  $("#toggle-mode").on("click", function () {
    const current = $body.attr("data-collection-mode");
    const newMode = current === "light" ? "dark" : "light";

    $body.attr("data-collection-mode", newMode);
    localStorage.setItem("bagel-mode", newMode);

    $icons.forEach((icon) => {
      const newSrc =
        newMode === "dark" ? icon.dataset.dark : icon.dataset.light;
      icon.setAttribute("src", newSrc);
    });
  });

  // =========================
  // 首頁輪播動畫（mySlides）
  // =========================
  let slideIndex = 0;
  let slideTimer = null;
  const slides = document.querySelectorAll(".mySlides");
  const dots = document.querySelectorAll(".dot");
  let isFirstLoad = true;

  function showSlide(targetIndex, direction = 1) {
    if (targetIndex >= slides.length) targetIndex = 0;
    if (targetIndex < 0) targetIndex = slides.length - 1;

    // 修正一開始畫面模糊的問題
    if (isFirstLoad) {
      const firstSlide = slides[targetIndex];
      firstSlide.classList.add("active");
      firstSlide.style.opacity = 1;
      firstSlide.style.transform = "translateX(0)";
      firstSlide.style.filter = "none";
      firstSlide.style.transition = "none";
      firstSlide.style.zIndex = 2;

      dots[targetIndex].classList.add("active");

      slideIndex = targetIndex;
      isFirstLoad = false;
      return;
    }

    const prevIndex = slideIndex;

    dots.forEach((dot) => dot.classList.remove("active"));

    // 👉 新圖片準備進場（先放在畫面外）
    const newSlide = slides[targetIndex];
    newSlide.style.transition = "none";
    newSlide.style.transform =
      direction === 1 ? "translateX(100%)" : "translateX(-100%)";
    newSlide.style.opacity = 0.8;
    newSlide.style.zIndex = 2;

    // 👉 舊圖片滑出（與新圖片方向相反）
    const oldSlide = slides[prevIndex];
    oldSlide.style.transition = "opacity 0.6s ease, filter 0.6s ease";
    oldSlide.style.opacity = 0.4; // 更淡一點
    oldSlide.style.filter = "blur(3px)";
    oldSlide.style.transform = "translateX(0)"; // 不滑動
    oldSlide.style.zIndex = 1;

    // 👉 啟動畫面重繪後，觸發新圖片滑入
    requestAnimationFrame(() => {
      newSlide.classList.add("active");
      newSlide.style.transition =
        "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease";
      newSlide.style.transform = "translateX(0)";
      newSlide.style.opacity = 1;
    });

    // 👉 設定 index / dot 樣式
    slideIndex = targetIndex;
    dots[slideIndex].classList.add("active");

    // 👉 動畫完成後清除舊圖片狀態
    setTimeout(() => {
      slides.forEach((slide, i) => {
        if (i !== slideIndex) {
          slide.classList.remove("active");
          slide.style.transition = "none";
          slide.style.opacity = 0;
          slide.style.transform = "translateX(0)";
          slide.style.zIndex = 1;
          slide.style.filter = "none";
        }
      });
    }, 700);
  }

  function plusSlides(n) {
    const dir = n > 0 ? 1 : -1;
    showSlide(slideIndex + n, dir);
    resetAutoSlide();
  }

  function currentSlide(n) {
    const dir = n > slideIndex ? 1 : -1;
    showSlide(n, dir);
    resetAutoSlide();
  }

  function startAutoSlide() {
    slideTimer = setInterval(() => {
      plusSlides(1);
    }, 4000);
  }

  function resetAutoSlide() {
    clearInterval(slideTimer);
    startAutoSlide();
  }
  // 暫停自動輪播，方便測試
  // function stopAutoSlide() {
  //   clearInterval(slideTimer);
  // }

  // 初始化
  if (slides.length > 0) {
    showSlide(0);
    startAutoSlide();

    document.querySelector(".prev").addEventListener("click", () => {
      plusSlides(-1);
    });
    document.querySelector(".next").addEventListener("click", () => {
      plusSlides(1);
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => {
        currentSlide(index);
      });
    });
    //stopAutoSlide(); // 暫停自動輪播，方便測試

    // 👉 手機滑動支援
    let startX = 0;
    let endX = 0;

    const touchArea = document.querySelector(".slideshow-container");

    // 設定 touchstart 時阻止預設行為（需要 passive: false）
    touchArea.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        // 必須搭配 passive: false
        e.preventDefault();
      },
      { passive: false }
    );
    touchArea.addEventListener(
      "touchend",
      (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
      },
      { passive: true }
    );

    function handleSwipe() {
      const diff = endX - startX;
      const threshold = 50; // 滑動最小距離才會觸發（避免誤觸）

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          plusSlides(-1); // 往右滑，顯示上一張
        } else {
          plusSlides(1); // 往左滑，顯示下一張
        }
      }
    }
  }
});
