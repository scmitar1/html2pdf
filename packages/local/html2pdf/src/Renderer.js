Ext.define('Html2pdf.Renderer', {
    alternateClassName: 'Html2pdfRenderer',
    singleton: true,
    getRenderer: function () {
        return {
            getNumberValue: function (k) {
                var v = this.getValue(k);

                if (v && Ext.isNumeric(k)) {
                    return Ext.util.Format.number(v, '#,###');
                } else {
                    return '-';
                }
            },
            getNumberValueForLoop: function (values, k) {
                var v = values[k];

                if (v && Ext.isNumeric(v)) {
                    return Ext.util.Format.number(v, '#,###');
                } else {
                    return '-';
                }
            },
            getTextValue: function (k) {
                var v = this.getValue(k);

                if (v) {
                    return '' + v;
                }
            },
            getValue: function (k) {
                var addr = k.split('.'),
                    values = this.fn.arguments[1],
                    cursor = values, v;

                Ext.each(addr, function (str) {
                    v = cursor = cursor && cursor[str];
                });

                return v;
            }
        };
    }
});