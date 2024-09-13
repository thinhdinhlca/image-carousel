window.function = function (img, legend,delimiter,dot_color,img_height,img_resized,fit, shortcuts, time) {
  
  // img
  img = img.value ?? "";
  if (img == "") return;
  let imgs = img.split(",");
   for (var i = 0; i < imgs.length; i++) {
     imgs[i] = imgs[i].trim()
 }

  delimiter = delimiter.value ?? "||";
  dot_color = dot_color.value ?? "#717171";
  img_height = img_height.value ?? "750";
  img_resized = img_resized.value ?? "375";

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

    htmlImg += `<span class="slide"><img src="${imgs[i]}" alt="" class="myImg"/>${caption}</li></span>
   `;

    if (dotEnable)
      htmldot += `<span class="dot" onclick="showSlides(${i})"></span>`;

    if (thumbnailEnable)
      htmlthumbnail += `<span><img class="thumbnailImg" src="${imgs[i]}" alt="" onclick="showSlides(${i})" /></span>`;
  }

  let ht = `<!DOCTYPE html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="https://unpkg.com/@panzoom/panzoom@4.4.1/dist/panzoom.min.js"></script>
</head>
<html>
  <style>
    .slider {
    }

    .wrapper {
      overflow: hidden;
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100vh;
      border-radius: 0px;
    }

    #items {
      width: 10000px;
      position: relative;
      top: 0;
      left: -100vw;
    }

    #items.shifting {
      transition: left 0.7s ease-out;
    }

    .slide {
      width: 100vw;
      height: 100vh;
      cursor: pointer;
      float: left;
      display: flex;
      flex-direction: column;
      justify-content: center;
      transition: all 1s;
      position: relative;
    }

    .slide img {
      height: ${img_resized}px;
      object-fit: ${objectFit};
    }

    .control {
      position: absolute;
      top: 50%;
      border-radius: 20px;
      margin-top: -20px;
      box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
      z-index: 2;
    }

    .prev {
      left: -20px;
    }

    .next {
      right: -20px;
    }

    .prev,
    .next {
      cursor: pointer;
      position: absolute;
      top: 50%;
      width: auto;
      padding: 16px;
      color: white;
      font-weight: bold;
      font-size: 18px;
      transition: 0.6s ease;
      border-radius: 20px;
      user-select: none;
      background-color: rgba(0, 0, 0, 0.8);
      box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
      z-index: 2;
    }

    /* On hover, add a black background color with a little bit see-through */
    .prev:hover,
    .next:hover {
      background-color: rgba(0, 0, 0, 0.8);
    }

    /* Caption text */
    .text {
      color: #f2f2f2;
      font-size: 18px;
      position: absolute;
      top: 100%;
      margin-top: -73px;
      padding: 8px 0px;
      width: calc(100vw - 15px);
      text-align: center;
      background-color: rgba(0, 0, 0, 0.6);
    }

    .dotAll {
      position: absolute;
      width: 100%;
      top: 100%;
      margin-top: -35px;
      z-index: 3;
    }

    /* The dots/bullets/indicators */
    .dot {
      cursor: pointer;
      height: 15px;
      width: 15px;
      margin: 10px 2px;
      border-radius: 50%;
      display: inline-block;
      transition: background-color 0.6s ease;
      background-color: #808080;
    }

    .dotActive,
    .dot:hover {
      background-color: ${dot_color};
    }

    /* On smaller screens, decrease text size */
    @media only screen and (max-width: 300px) {
      .prev,
      .next,
      .text {
        font-size: 11px;
      }
    }

    .thumbnail {
      position: absolute;
      top: 2px;
      left: 8px;
      margin-top: 8px;
      opacity: 1;
    }

    .thumbnail img {
      width: 10%;
      border-radius: 5px;
      cursor: pointer;
    }

    .thumbnailsActive {
      opacity: 0.3;
      box-shadow: inset 0 0 1em gold, 0 0 1em black;
    }
  </style>

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

        if (${time} == 0)
        {
          clearTimeout(auto);
        }
        else
        {
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

        if (dots.length > 0)
        {
          for (let i = 0; i < dots.length; i++) {
            dots[i].className = dots[i].className.replace(" dotActive", "");
          }
          dots[index].className += " dotActive";
        }

        if (thumbnails.length > 0)
        {
          for (let i = 0; i < thumbnails.length; i++) {
            thumbnails[i].className = thumbnails[i].className.replace(" thumbnailsActive", "");
          }
          thumbnails[index].className += " thumbnailsActive";
        }
        allowShift = true;

        auto = setTimeout(slideauto, ${time});
        
      }
 
    window.onload = function () {
  
      let allimg = document.querySelectorAll(".myImg")
      allimg.forEach((item, index) => {
      const panzoom = Panzoom(item, { maxScale: 5 });
      item.parentElement.addEventListener('wheel', panzoom.zoomWithWheel)
      });
    }
    </script>
  </body>
</html>`;

  let enc = encodeURIComponent(ht);
  let uri = `data:text/html;charset=utf-8,${enc}`;
  return uri;
};
