Ext.define('Html2pdf.Util', {
    alternateClassName: 'Html2pdfUtil',
    singleton: true,
    defaultConfig: {
        margin: 5,
    },
    downloadFile: function (args) {
        this.loadLib(function () {
            var inst = html2pdf(),
                element = args['element'],
                fileName = args['fileName'],
                cfg = Ext.apply(this.defaultConfig, {
                    filename: fileName || 'pdf.pdf',
                    margin: 5
                });

            inst.set(cfg).from(element).then(function () {
                var me = this;

                setTimeout(function () {
                    me.save()
                }, 500);
            });
        });
    },

    getFile: function (args) {
        this.loadLib(function () {
            var file, ab, idx, uint8Array,
                element = args['element'],
                fileName = args['fileName'],
                cfg = Ext.apply(this.defaultConfig, {
                    filename: fileName || 'pdf.pdf',
                    margin: 5
                });

            return new Promise(function (res) {
                html2pdf().set(cfg).from(element).then(function () {
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
            });
        })
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
    }
});
