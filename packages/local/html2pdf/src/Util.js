Ext.define('Html2pdf.Util', {
    requires: [
        'Html2pdf.Lib'
    ],
    alternateClassName: 'Html2pdfUtil',
    singleton: true,
    downloadFile: function (element) {
        if (window['html2pdf']) {
            var inst = html2pdf();
            inst.set({
                filename: 'pdf.pdf',
                margin: 5
            }).from(element).save();
        }
    },

    getFile: function (element) {
        var file, ab, idx, uint8Array;

        return new Promise(function (res) {
            html2pdf().set({
                filename: 'pdf.pdf',
                margin: 5
            }).from(element).outputPdf().then(function (str) {
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
            });
        });
    }
});
