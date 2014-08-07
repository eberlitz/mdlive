TocMaker = (function () {

    // Slug function
    function slugify(text) {
        return text.toLowerCase().replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
    };

    function TocElement(tagName, anchor, text,baseUrl) {
        this.tagName = tagName;
        this.anchor = anchor;
        this.text = text;
        this.baseUrl = baseUrl;
        this.children = [];
    }
    TocElement.prototype.childrenToString = function () {
        if (this.children.length === 0) {
            return "";
        }
        var result = "<ul>\n";
        for (var i = 0; i < this.children.length; i++) {
            result += this.children[i].toString();
        };
        result += "</ul>\n";
        return result;
    };
    TocElement.prototype.toString = function () {
        var result = "<li>";
        if (this.anchor && this.text) {
            result += '<a href="'+(this.baseUrl||'') + '#' + this.anchor + '">' + this.text + '</a>';
        }
        result += this.childrenToString() + "</li>\n";
        return result;
    };

    function groupTags(array, level) {
        level = level || 1;
        var tagName = "H" + level;
        var result = [];

        var currentElement = undefined;
        function pushCurrentElement() {
            if (currentElement !== undefined) {
                if (currentElement.children.length > 0) {
                    currentElement.children = groupTags(currentElement.children, level + 1);
                }
                result.push(currentElement);
            }
        }

        for (var i = 0; i < array.length; i++) {
            var element = array[i];
            if (element.tagName != tagName) {
                if (currentElement === undefined) {
                    currentElement = new TocElement();
                }
                currentElement.children.push(element);
            }
            else {
                pushCurrentElement();
                currentElement = element;
            }
        };

        pushCurrentElement();
        return result;
    }

    function buildToc(elementId,baseUrl) {
        var anchorList = {};
        function createAnchor(element) {
            var id = element.id || slugify(element.textContent);
            var anchor = id;
            var index = 0;
            while (!!anchorList[anchor]) {
                anchor = id + "-" + (++index);
            }
            anchorList[anchor] = true;

            if (element.id != anchor) {
                // Update the id of the element
                element.id = anchor;
                var tagA = document.createElement('a');
                tagA.className = "atoc icon-link hidden-print";
                tagA.href = (baseUrl||'') + "#" + anchor;
                tagA.title = "Link direto";
                //tagA.innerHTML = "&para; ";

                element.insertBefore(tagA, null);
                // não funciona em Firefox
                //element.insertAdjacentElement('afterbegin', tagA);
            }
            return anchor;
        }
        var contentEl = document.getElementById(elementId || 'content');
        var headers = contentEl.querySelectorAll("h1,h2,h3,h4,h5,h6");
        headers = Array.prototype.slice.call(headers, 0);
        headers = headers.map(function (elt) {
            return new TocElement(elt.tagName, createAnchor(elt), elt/*.childNodes[0]*/.textContent,baseUrl);
        });
        headers = groupTags(headers);
        return '<div class="toc">\n<ul>\n' + headers.join("") + '</ul>\n</div>\n';
    }

    function init(elementId, baseUrl) {
        var contentEl = document.getElementById(elementId || 'content');
        var allp = document.querySelectorAll("p");
        allp = Array.prototype.slice.call(allp, 0);
        allp = allp.filter(function (itm, i, a) {
            return /^\[(TOC|toc)\]$/g.test(itm.innerHTML);
        });

        if (allp.length > 0) {
            var htmlToc = buildToc(elementId,baseUrl);
            for (var i = 0; i < allp.length; i++) {
                var node = allp[i];
                node.innerHTML = htmlToc;
            };
        };
    }


    return {
        init: init,
        buildToc: buildToc
    };
})();