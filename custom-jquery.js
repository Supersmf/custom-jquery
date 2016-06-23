(function(window) {
    var elems = [];
    var RestulObj = function() {
    };
    RestulObj.prototype.each = function(cb) {
        for(var prop in this) {
            if (!isNaN(parseFloat(prop)) && isFinite(prop)) {
                var returnVal = cb.call(this[prop], parseFloat(prop), this[prop]);
                if (returnVal === false) {
                    return this;
                }
            }
        }
        return this;
    };

    RestulObj.prototype.on = function(event, sel, cb) {
        if (typeof sel !== 'string') {
            cb = sel;
            this.each(function(i, item) {
                item.addEventListener(event, cb);
            });
        } else {
            window.$(sel).on(event, cb);
        }
        return this;
    };

    RestulObj.prototype.addClass = function(classVal) {
        if (typeof classVal === 'string') {
            this.each(function(i, item) {
                item.classList.add.apply(item.classList, classVal.split(' '));
            });
        } else {
            this.each(function(i, item) {
                var className = classVal(i, item.className);
                item.className = className;
            });
        }
    };

    RestulObj.prototype.data = function() {
        var dataProp;
        if (!arguments.length) {
            return this[0].dataset;
        } else if (arguments.length === 1 && typeof arguments[0] === 'string') {
            dataProp = arguments[0];
            return this[0].dataset[dataProp];
        } else if (arguments.length === 2) {
            dataProp = arguments[0];
            var dataVal = arguments[1];
            this.each(function(i, item) {
                item.dataset[dataProp] = dataVal;
            });
        } else if (arguments.length === 1 && typeof arguments[0] === 'object') {
            dataProp = arguments[0];
            this.each(function(i, item) {
                Object.assign(item.dataset, dataProp);
            });
        } 
    };

    RestulObj.prototype.children = function(sel) {
        if (!sel) {
            return this[0].children;
        } else {
            var children = this[0].children;
            var resultArr = [];
            for (var i = 0; i < children.length; i++) {
                if (children[i].classList.contains(sel.substring(1))) {
                    resultArr.push(children[i]);
                }
            }
            return resultArr;
        }
    };

    RestulObj.prototype.attr = function(attrName, attrValue) {
        if (!attrValue) {
            return this[0].attributes[attrName].value;
        } else {
            this.each(function(i, item) {
                item.setAttribute(attrName, attrValue);
            });
        }
    };

    RestulObj.prototype.css = function(style) {
        if (typeof style === 'string') {
            return this[0].style[style];
        } else {
            this.each(function(i, item) {
                Object.assign(item.style, style);
            });
        }
    };

    RestulObj.prototype.append = function(content) {
        if (typeof content === 'string') {
            this.each(function(i, item) {
                item.innerHTML += content;
            });
        } else {
            this.each(function(i, item) {
                item.innerHTML += content.outerHTML;
            });
        }
    };

    RestulObj.prototype.one = function(event, cb) {
        function handler(e) {
            e.target.removeEventListener(e.type, handler);
            cb(e);
        }

        this.each(function(i, item) {
            item.addEventListener(event, handler);
        });
    };

    RestulObj.prototype.html = function(content) {
        if (!content) {
            return this[0].innerHTML;
        }

        this.each(function(i, item) {
            item.innerHTML = content;
        });

        return this;
    };

    window.$ = function(sel) {
        var resultObj = new RestulObj();
        if (typeof sel === "string") {
            elems = document.querySelectorAll(sel);

            for (var i = 0; i < elems.length; i++) {
              resultObj[i] = elems[i];
            }
        } else if (typeof sel === "object") {
            elems.push(sel);
            resultObj[0] = sel;
            return resultObj;
        }
        return resultObj;
    };

})(window);
