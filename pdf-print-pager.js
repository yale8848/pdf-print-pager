(function(window) {





    var Size = {
        Letter: ['8.5in', '11in'],
        Legal: ['8.5in', '14in'],
        Tabloid: ['11in', '17in'],
        Ledger: ['17in', '11in'],
        A0: ['33.1in', '46.8in'],
        A1: ['23.4in', '33.1in'],
        A2: ['16.5in', '23.4in'],
        A3: ['11.7in', '16.5in'],
        A4: ['8.27in', '11.7in'],
        A5: ['5.83in', '8.27in'],
        A6: ['4.13in', '5.83in']
    };

    function PdfPager() {


    }

    PdfPager.prototype.config = function(conf) {

        var defaultConfig = {
            format: 'A4',
            margin: "0px",
            header: {
                height: "0px",
                contents: function(pageNum, numPages, currentHeader) {
                    return "";
                }
            },
            footer: {
                height: "0px",
                contents: function(pageNum, numPages, currentFooter) {
                    return "";
                }
            }

        };
        var cf = conf || defaultConfig;
        if (!cf.format) {
            cf.format = defaultConfig.format;
        }
        if (!Size[cf.format]) {
            cf.format = defaultConfig.format;
        }
        if (!cf.margin) {
            cf.margin = defaultConfig.margin;
        }
        if (!cf.header) {
            cf.header = defaultConfig.header;
        }
        if (!cf.header.height) {
            cf.header.height = defaultConfig.header.height;
        }
        if (!cf.header.contents) {
            cf.header.contents = defaultConfig.header.contents;
        }

        if (!cf.footer) {
            cf.footer = defaultConfig.footer;
        }
        if (!cf.footer.height) {
            cf.footer.height = defaultConfig.footer.height;
        }
        if (!cf.footer.contents) {
            cf.footer.contents = defaultConfig.footer.contents;
        }

        return cf;
    };
    PdfPager.prototype.render = function(config, page, render) {

        var cd = document.body.firstChild;

        var pageNum = 1;
        var pageHeight = page.margin;

        var paged = {};

        function addHeader(el, height, content) {
            if (height > 0) {

            }
            if (!render || !content || height == 0 || content.length == 0) {
                return;
            }

        }

        function addFooter(el, height, content) {
            if (!render || !content || height == 0 || content.length == 0) {
                return;
            }
        }
        while (cd) {

            if (!paged[pageNum]) {
                var h = {};
                config.header.contents(pageNum, page.numPages, h);
                if (!h.height) {
                    h.height = config.header.height;
                }
                var f = {};
                config.footer.contents(pageNum, page.numPages, f);
                if (!f.height) {
                    f.height = config.footer.height;
                }

                paged[pageNum] = {
                    header: this.getPX(h.height),
                    footer: this.getPX(f.height)
                };
                pageHeight += paged[pageNum].header;
                pageHeight += paged[pageNum].footer;

                if (paged[pageNum].header > 0) {



                }

            }

            if (cd) {

                if (cd.nodeType == 1) {
                    pageHeight += cd.offsetHeight;
                    if (pageHeight > page.height) {
                        pageNum++;
                        pageHeight = page.margin + cd.offsetHeight;
                    }
                }

            }
            cd = cd.nextSibling;
        }
        page.numPages = pageNum;

    }
    PdfPager.prototype.computePageSize = function(config) {
        var page = {};

        page.width = this.getPX(Size[config.format][0]);
        page.height = this.getPX(Size[config.format][1]);
        page.headerHeight = this.getPX(config.header.height);
        page.footerHeight = this.getPX(config.footer.height);


        document.body.style.padding = '0px';
        document.body.style.margin = '0px';

        page.margin = this.getPX(config.margin);
        page.numPages = 1000000;


        this.render(config, page, false);

        return page;
    };
    PdfPager.prototype.getPX = function(v) {
        var pos = v.toString().toLowerCase().indexOf('px');
        if (pos > 0) {
            return parseInt(v.toString().substr(0, pos));
        }
        var tmpNode = document.createElement("DIV");
        tmpNode.style.cssText = "width:" + v + ";height:+" + v + ";position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
        document.body.appendChild(tmpNode);
        var px = parseInt(tmpNode.offsetWidth);
        tmpNode.parentNode.removeChild(tmpNode);
        return px;
    };
    PdfPager.prototype.init = function(conf) {

        var config = this.config(conf);
        var page = this.computePageSize(config);
        this.render(config, page, true);



    };

    window.pdfPager = new PdfPager();

})(window);