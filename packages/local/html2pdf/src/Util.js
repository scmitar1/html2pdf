Ext.define('Html2pdf.Util', {
    alternateClassName: 'Html2pdfUtil',
    singleton: true,
    defaultConfig: {
        margin: 5,
        // html2canvas:  { dpi: 96, letterRendering: true } 혹시 몰라서..
    },

    getDefaultInst: function (args) {
        var $win = args['window'];

        if ($win && window !== $win) {
            return $win.html2pdf()
        } else {
            return html2pdf();
        }
    },

    downloadFile: function (args) {
        var $me = this,
            $win = args['window'],
            fn = function () {
                var inst = $me.getDefaultInst(args),
                    element = args['element'],
                    fileName = args['fileName'],
                    cfg = Ext.apply($me.defaultConfig, {
                        filename: fileName || 'pdf.pdf'
                    });

                inst.set(cfg).from(element).then(function () {
                    var me = this;

                    setTimeout(function () {
                        me.save()
                    }, 500);
                });
            };

        if ($win && window !== $win) {
            fn();
        } else {
            this.loadLib(function () {
                fn();
            });
        }
    },

    getFile: function (args) {
        var $me = this,
            $win = args['window'],
            fn = function (res) {
                var file, ab, idx, uint8Array,
                    element = args['element'],
                    fileName = args['fileName'],
                    cfg = Ext.apply($me.defaultConfig, {
                        filename: fileName || 'pdf.pdf',
                        margin: 5
                    });

                $me.getDefaultInst(args).set(cfg).from(element).then(function () {
                    var me = this;

                    setTimeout(function () {
                        me.outputPdf().then(function (str) {
                            ab = new ArrayBuffer(str.length);
                            uint8Array = new Uint8Array(ab);
                            idx = str.length;
                            for (; idx--;) {
                                uint8Array[idx] = str.charCodeAt(idx);
                            }
                            file = new Blob([ab], {
                                type: 'application/pdf'
                            });
                            res(file);
                        })
                    }, 500);
                });
            };

        if ($win && $win !== window) {
            return new Promise(function (res) {
                fn(res);
            });
        } else {
            return new Promise(function (res) {

                $me.loadLib(function () {
                    fn(res);
                });
            });
        }
    },

    loadLib: function (callback) {
        if (!window.html2pdf) {
            Ext.Loader.loadScript({
                url: Ext.getResourcePath('html2pdf') + '/lib/html2pdf.js',
                onLoad: function () {
                    callback();
                }
            });
        } else {
            callback();
        }
    },

    loadLibToIframe: function (cfg) {
        var script,
            win = cfg['window'],
            template = cfg['template'],
            data = cfg['data'],
            html = template && template['url'],
            config = (template && template['config']) || {};

        fetch(html)
            .then(function (res) {
                return res.text();
            })
            .then(function (html) {
                win.document.write(new Ext.XTemplate([
                    html,
                    config
                ]).apply(data));
            })
            .then(function () {
                fetch(Ext.getResourcePath('html2pdf') + '/lib/html2pdf.js')
                    .then(function (res) {
                        return res.text();
                    })
                    .then(function (txt) {
                        script = win.document.createElement('script');
                        script.text = txt;
                        win.document.head.appendChild(script);
                    });
            });
    }
});
