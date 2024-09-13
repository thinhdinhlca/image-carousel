window.function = function (img, legend, delimiter, dot_color, img_height, img_resized, fit, shortcuts, time) {
  
  // img
  img = img.value ?? "";
  if (img == "") return;
  let imgs = img.split(",");
  for (var i = 0; i < imgs.length; i++) {
    imgs[i] = imgs[i].trim();
  }

  delimiter = delimiter.value ?? "||";
  dot_color = dot_color.value ?? "#717171";
  img_height = img_height.value ?? "auto"; // Set to auto for responsive height
  img_resized = img_resized.value ?? "auto"; // Set to auto for responsive height

  // legend
  legend = legend.value ?? "";
  let legends = legend.split("||");

  // fit
  fit = fit.value ?? "";
  fit = fit.toLowerCase();

  let objectFit = "cover";

  switch (objectFit) {
    case "fill":
    case "cover":
    case "contain":
    case "scale-down":
    case "none":
      objectFit = fit;
      break;
    default:
      objectFit = "cover";
  }

  // shortcuts
  shortcuts = shortcuts.value ?? "";
  shortcuts = shortcuts.toLowerCase().trim();

  let dotEnable = 0;
  let thumbnailEnable = 0;

  if (shortcuts == "dot") {
    dotEnable = 1;
  }

  if (shortcuts == "thumbnail") {
    thumbnailEnable = 1;
  }

  // time
  time = time.value ?? 0;
  time = Math.abs(time) * 1000;

  // HTML
  let htmlImg = "";
  let htmldot = "";
  let htmlthumbnail = "";

  for (let i = 0; i < imgs.length; i++) {
    let caption = "";
    let leg = "";
    if (legends.length > i) {
      if (legends[i].trim() != "") {
        leg = legends[i].trim();
        caption = `<div class="text">${leg}</div>`;
      }
    }

    htmlImg += `<span class="slide"><img src="${imgs[i]}" alt="" class="myImg"/>${caption}</span>`;

    if (dotEnable)
      htmldot += `<span class="dot" onclick="showSlides(${i})"></span>`;

    if (thumbnailEnable)
      htmlthumbnail += `<span><img class="thumbnailImg" src="${imgs[i]}" alt="" onclick="showSlides(${i})" /></span>`;
  }

  let ht = `<!DOCTYPE html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    .slider {
      position: relative;
      overflow: hidden;
      height: auto; /* Allow height to adjust based on content */
    }

    .wrapper {
      width: 100%;
      height: auto; /* Allow height to adjust based on content */
    }

    .items {
      display: flex;
      transition: left 0.5s ease-out;
      position: relative;
      left: -100%;
    }

    .slide {
      flex: 0 0 100%; /* Each slide takes full width */
      height: auto; /* Allow height to adjust based on content */
    }

    .myImg {
      width: 100%;
      height: auto; /* Responsive height */
      object-fit: ${objectFit}; /* Use the 'fit' variable */
    }

    .control {
      cursor: pointer;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: 30px;
      color: white;
      z-index: 10;
    }

    .prev {
      left: 10px;
    }

    .next {
      right: 10px;
    }

    .dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      background-color: ${dot_color};
      border-radius: 50%;
      margin: 5px;
      cursor: pointer;
    }

    .dotActive {
      background-color: #717171; /* Active dot color */
    }

    .thumbnail {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }

    .thumbnailImg {
      width: 50px;
      height: auto; /* Responsive height */
      margin: 0 5px;
      cursor: pointer;
    }

    .thumbnailsActive {
      border: 2px solid #717171; /* Active thumbnail border */
    }
  </style>
  <script src="https://unpkg.com/@panzoom/panzoom@4.4.1/dist/panzoom.min.js"></script>
</head>
<html>
  <body>
    <div id="slider" class="slider">
      <div class="wrapper">
        <div id="items" class="items">
          ${htmlImg}
        </div>
        <a id="prev" class="control prev">&nbsp;&nbsp;&#10094;</a>
        <a id="next" class="control next">&#10095;&nbsp;&nbsp;</a>
        <div class="dotAll" style="text-align: center">
          ${htmldot}
        </div>
        <div class="thumbnail">
          ${htmlthumbnail}
        </div>
      </div>
    </div>
    
    <script>
      let wrapper = document.getElementById("slider");
      let items = document.getElementById("items");
      let prev = document.getElementById("prev");
      let next = document.getElementById("next");

      let dots = document.getElementsByClassName("dot");

      if(dots.length > 0)
        dots[0].className += " dotActive";

      let thumbnails = document.getElementsByClassName("thumbnailImg");
      
      if (thumbnails.length > 0)
        thumbnails[0].className += " thumbnailsActive";

      let posX1 = 0;
      let posX2 = 0;
      let posInitial;
      let posFinal;
      let threshold = 100;
      let slides = items.getElementsByClassName("slide");
      let slidesLength = slides.length;
      let slideSize = items.getElementsByClassName("slide")[0].offsetWidth;
      let firstSlide = slides[0];
      let lastSlide = slides[slidesLength - 1];
      let cloneFirst = firstSlide.cloneNode(true);
      let cloneLast = lastSlide.cloneNode(true);
      let index = 0;
      let allowShift = true;

      // Clone first and last slide
      items.appendChild(cloneFirst);
      items.insertBefore(cloneLast, firstSlide);
      wrapper.classList.add("loaded");

      // Click events
      prev.addEventListener("click", function () {
        shiftSlide(-1);
      });
      next.addEventListener("click", function () {
        shiftSlide(1);
      });

      // Transition events
      items.addEventListener("transitionend", checkIndex);

      // Windows resize
      window.onresize = reportWindowSize;

      function reportWindowSize() {
        window.location.reload();
      }

      // Automatique
      let auto = setTimeout(slideauto, ${time});

      function slideauto() {
        if (${time} == 0) {
          clearTimeout(auto);
        } else {
          shiftSlide(1);
          auto = setTimeout(slideauto, ${time});
        }
      }

      // Show 
      function showSlides(n) {
        let dif = n - index;
        if (dif != 0) shiftSlide(dif);
      }

      // Shift
      function shiftSlide(dir, action) {
        items.classList.add("shifting");
        
        clearTimeout(auto);
        
        if (allowShift) {
          if (!action) {
            posInitial = items.offsetLeft;
          }
          if (dir > 0) {
            items.style.left = posInitial - slideSize * dir + "px";
            index += dir;
          } else if (dir < 0) {
            items.style.left = posInitial + slideSize * Math.abs(dir) + "px";
            index += dir;
          }
        }

        allowShift = false;
      }

      function checkIndex() {
        clearTimeout(auto);
        items.classList.remove("shifting");

        if (index < 0) {
          items.style.left = -(slidesLength * slideSize) + "px";
          index = slidesLength - 1;
        }

        if (index >= slidesLength) {
          items.style.left = -(1 * slideSize) + "px";
          index = 0;
        }

        if (dots.length > 0) {
          for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" dotActive", "");
          }
          dots[index].className += " dotActive";
        }

        if (thumbnails.length > 0) {
          for (let i = 0; i < thumbnails.length; i++) {
            thumbnails[i].className = thumbnails[i].className.replace(" thumbnailsActive", "");
          }
          thumbnails[index].className += " thumbnailsActive";
        }
        allowShift = true;

        auto = setTimeout(slideauto, ${time});
      }
 
      window.onload = function () {
        let allimg = document.querySelectorAll(".myImg");
        allimg.forEach((item, index) => {
          const panzoom = Panzoom(item, { maxScale: 5 });
          item.parentElement.addEventListener('wheel', panzoom.zoomWithWheel);
        });
      }
    </script>
  </body>
</html>`;

  let enc = encodeURIComponent(ht);
  let uri = `data:text/html;charset=utf-8,${enc}`;
  return uri;
};
