var IMAGE_WIDTH = 3774
var IMAGE_HEIGHT = 2123
var ar = { w: IMAGE_WIDTH, h: IMAGE_HEIGHT, r: IMAGE_WIDTH / IMAGE_HEIGHT }
var BACK_POS

//
// init
//
//

$(function () {
  // create all dynamic elements
  selectedEls.map(createEl)

  // perform resize repositioning
  positionEls()
  $(window).resize(positionEls)

  // set up menu button hover change button
  createMenuHoverHandler(
    ".menu-1-closed, .menu-2-closed, .menu-3-closed, .menu-4-closed, .menu-5-closed, .menu-6-closed, .menu-7-closed",
    "closed"
  )

  $(".lin").click(function (e) {
    let imgStr = $(".imageDisplay > img")[0].src
    var verso = imgStr.indexOf("-verso")
    var p = imgStr.lastIndexOf(".")
    if (verso < 0) {
      imgStr = imgStr.substring(0, p) + "-verso" + imgStr.substring(p)
      btnStr = "../assets/img/buttons/button-pro.png"
    } else {
      imgStr = imgStr.substring(0, verso) + imgStr.substring(p)
      btnStr = "../assets/img/buttons/button-ref.png"
    }
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

  $(".scrollbox-4 img, .scrollbox-5 img, .scrollbox-6 img, .scrollbox img").click(function (e) {
    openShadowBox(e.target.src)
  })
  // $(".scrollbox ul li:not(:first-child) img").click(function (e) {
  //   var str = e.target.src
  //   var p1 = str.lastIndexOf("/")
  //   var p2 = str.lastIndexOf(".")
  //   str =
  //     str.substring(0, p1 + 1) +
  //     "pop1/" +
  //     str.substring(p1 + 1, p2) +
  //     "-pop" +
  //     str.substring(p2)
  //   openShadowBox(str)
  // })

  // $(".scrollbox-4 ul li img").click(function (e) {
  //   var str = e.target.src
  //   var p1 = str.lastIndexOf("/")
  //   var p2 = str.lastIndexOf(".")
  //   str =
  //     str.substring(0, p1 + 1) +
  //     "pop1/" +
  //     str.substring(p1 + 1, p2) +
  //     "-pop" +
  //     str.substring(p2)
  //   openShadowBox(str)
  // })

  $(
    ".c1, .c2, .c3, .c4, .c5, .c6, .offre1, .offre2, .offre3, .offre4, .h1, .h2, .h3, .h4, .p1, .p2, .p3, .p4, .p5 , .p6, .p7, .p8, .p9, .p10, .p11, .p12 , .s1, .s2, .s3, .s4, .s5 , .s6, .s7, .s8, .s9, .s10, .s11, .s12, .s13, .s14, .s15,.s16, .s17, .s18,.s19, .s20, .s21, .s22, .s23, .s24, .s25, .s26, .s27"
  ).click(function (e) {
    var bg = $(this).css("background-image")
    bg = bg.replace("url(", "").replace(")", "").replace(/\"/gi, "")
    openShadowBox(bg)
  })
  $(".shadow").click(closeShadowBox)
})

//
// functions for page handling
//
//

// magnify function
function magnify() {
  // set up image magnification
  if (typeof $.fn.blowup == "function")
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
    var $el = createEl(newName)
    positionEl(newName)
    createMenuHoverHandler("." + newName, state)
    $this.remove()
  }
}

//
// remove and add all elements required
//
//

function positionEls() {
  // recalculate background
  BACK_POS = calcImageDimensions()
  // reposition elements
  selectedEls.map(positionEl)
}

function positionEl(el) {
  //console.log(" >> positioning ", el)
  var nel = getElByName(el)
  if (!nel) return
  var newEl = transformElement(nel, BACK_POS)
  $("." + nel.name).css({
    top: newEl.y,
    left: newEl.x,
    width: newEl.w,
    height: newEl.h,
  })
}

function createEl(el) {
  //console.log(" >> creating ", el)
  var nel = getElByName(el)
  if (!nel) return
  return $(nel.el).appendTo("body")
}

function getElByName(name) {
  return ELEMENTS.find((m) => m.name == name)
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
// calculate the area of zindoz
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
  //console.log("image:", img)
  return img
}

//
// other
//
//
