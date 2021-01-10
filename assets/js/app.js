var IMAGE_WIDTH = 3774
var IMAGE_HEIGHT = 2123
var ar = { w: IMAGE_WIDTH, h: IMAGE_HEIGHT, r: IMAGE_WIDTH / IMAGE_HEIGHT }
var BACK_POS

//
// init
//
//

$(function () {
  resizeHandler()
  $(window).resize(resizeHandler)
  // set up menu button hover change button
  createMenuHoverHandler(
    ".menu-1-closed, .menu-2-closed, .menu-3-closed, .menu-4-closed, .menu-5-closed, .menu-6-closed, .menu-7-closed",
    "closed"
  )

  // magnify function
  function magnify() {
    // set up image magnification
    if (typeof $(".magnify").blowup == "function")
      $(".magnify").blowup({
        background: "#F39C12",
        width: 250,
        height: 250,
        scale: 1,
      })
  }

  // set up scrollbox shadowbox
  function openShadowBox(str) {
    $(".imageDisplay > img").attr("src", str)
    $(".shadow").css("display", "inherit")
    $(".imageDisplay").css("display", "inherit")
    magnify()
  }
  function closeShadowBox() {
    $(".shadow").css("display", "none")
    $(".imageDisplay").css("display", "none")
  }

  $(".lin").click(function (e) {
    let imgStr = $(".imageDisplay > img")[0].src
    console.log(imgStr)
    var verso = imgStr.indexOf("-verso")
    var p = imgStr.lastIndexOf(".")
    if (verso < 0) {
      imgStr = imgStr.substring(0, p) + "-verso" + imgStr.substring(p)
      btnStr = "/assets/img/buttons/button-pro.png"
    } else {
      imgStr = imgStr.substring(0, verso) + imgStr.substring(p)
      btnStr = "/assets/img/buttons/button-ref.png"
    }
    console.log("NOUVEAU STRING: ", imgStr)
    $(".imageDisplay > img").attr("src", imgStr)
    $(".lin").attr("src", btnStr)
    magnify()
  })

  $(".plan1").click(function (e) {
    openShadowBox("../assets/img/plans/planpop1.png")
  })
  $(".plan2").click(function (e) {
    openShadowBox("../assets/img/plans/planpop2.png")
  })
  $(".plan3").click(function (e) {
    openShadowBox("../assets/img/plans/planpop3.png")
  })

  $(".d1").click(function (e) {
    openShadowBox("../assets/img/distributeurs/d1-pop.png")
  })
  $(".d2").click(function (e) {
    openShadowBox("../assets/img/distributeurs/d2-pop.png")
  })
  $(".d3").click(function (e) {
    openShadowBox("../assets/img/distributeurs/d3-pop.png")
  })
  $(".cal-1").click(function (e) {
    openShadowBox("../assets/img/cal-1pop.png")
  })

  $(".scrollbox-4 img, .scrollbox-5 img").click(function (e) {
    openShadowBox(e.target.src)
  })
  $(".scrollbox ul li:not(:first-child) img").click(function (e) {
    var str = e.target.src
    var p1 = str.lastIndexOf("/")
    var p2 = str.lastIndexOf(".")
    str =
      str.substring(0, p1 + 1) +
      "pop1/" +
      str.substring(p1 + 1, p2) +
      "-pop" +
      str.substring(p2)
    openShadowBox(str)
  })

  $(".scrollbox-4 ul li img").click(function (e) {
    var str = e.target.src
    var p1 = str.lastIndexOf("/")
    var p2 = str.lastIndexOf(".")
    str =
      str.substring(0, p1 + 1) +
      "pop1/" +
      str.substring(p1 + 1, p2) +
      "-pop" +
      str.substring(p2)
    console.log(str)
    openShadowBox(str)
  })

  $(
    ".c1, .c2, .c3, .c4, .c5, .c6, .k1, .k2, .offre1, .offre2, .offre3, .offre4, .h1, .h2, .h3, .h4"
  ).click(function (e) {
    var bg = $(this).css("background-image")
    bg = bg.replace("url(", "").replace(")", "").replace(/\"/gi, "")
    openShadowBox(bg)
  })
  $(".shadow").click(closeShadowBox)
})

//
// handle menu item hover
//
//

function createMenuHoverHandler(els, type) {
  if (type == "open") $(els).mouseleave(handleMenu("closed"))
  else $(els).mouseenter(handleMenu("open"))
}

function handleMenu(state) {
  return function () {
    var $this = $(this)
    var n = $this.data("n")
    var newName = "menu-" + n + "-" + state
    var newEl = getElByName(newName)
    createEl(newEl)
    createMenuHoverHandler("." + newName, state)
    $this.remove()
  }
}

//
// remove and add all elements required
//
//

function resizeHandler() {
  // remove old elements
  $(".del").remove()
  // background
  BACK_POS = calcImageDimensions()
  // elements
  selectedEls.map(createEl)
}

function createEl(el) {
  if (typeof el == "string") el = getElByName(el)
  if (!el) return
  var newEl = transformElement(el, BACK_POS)
  var $el = $(el.el).appendTo("body")
  $el.css({
    top: newEl.y,
    left: newEl.x,
    width: newEl.w,
    height: newEl.h,
  })
}

function getElByName(name) {
  return ELEMENTS.filter((m) => m.name == name)[0]
}

//
// transform element positioning
//
//

function transformElement(elementPos, BACK_POS) {
  return {
    x: BACK_POS.x + (elementPos.x / ar.w) * BACK_POS.w,
    y: BACK_POS.y + (elementPos.y / ar.h) * BACK_POS.h,
    w: (elementPos.w / ar.w) * BACK_POS.w,
    h: (elementPos.h / ar.h) * BACK_POS.h,
  }
}

//
// calculate the area
//
//
function calcImageDimensions() {
  console.log("calculating image size ... ")
  // get window dimensions
  var win = {
    w: window.innerWidth,
    h: window.innerHeight,
  }
  win.r = win.w / win.h
  console.log("window:", win)
  console.log("margins detected:", win.r > ar.r ? "HORIZONTAL" : "VERTICAL")
  // get image dimensions
  var img = { r: ar.r }
  if (win.r < ar.r) {
    // VERTICAL MARGINS
    img.w = win.w
    img.h = img.w / img.r
    img.x = 0
    img.y = (win.h - img.h) / 2
  } else {
    img.h = win.h
    img.w = img.h * img.r
    img.y = 0
    img.x = (win.w - img.w) / 2
  }
  console.log("image:", img)
  return img
}

//
// other
//
//
