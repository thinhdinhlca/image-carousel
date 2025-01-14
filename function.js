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

let showArrows = imgs.length > 1 ? true : false;
let arrowsDisplay = showArrows ? '' : 'style="display: none;"';

let ht = `
${htmlImg}
${htmldot}${htmlthumbnail}<script>
    let wrapper = document.getElementById("slider");
    let items = document.getElementById("items");
    let prev = document.getElementById("prev");
    let next = document.getElementById("next");

    // Hide navigation arrows if only one image
    if (${!showArrows}) {
        prev.style.display = "none";
        next.style.display = "none";
    }

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
        }
        else {
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
        let allimg = document.querySelectorAll(".myImg")
        allimg.forEach((item, index) => {
            const panzoom = Panzoom(item, { maxScale: 5 });
            item.parentElement.addEventListener('wheel', panzoom.zoomWithWheel)
        });
    }
</script>`;

let enc = encodeURIComponent(ht);
let uri = `data:text/html;charset=utf-8,${enc}`;
return uri;
};
