/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('Template.Application', {
    extend: 'Ext.app.Application',

    name: 'Template',

    requires: [
        'Template.*'
    ],

    launch: function () {
        Ext.widget('window', {
            title: 'Preview',
            layout: 'fit',
            maximized: true,
            maximizable: true,
            items: [
                {
                    xclass: 'Html2pdf.view.Preview',
                    template: {
                        url: 'resources/html/template2.html',
                        config: {
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
                        }
                    },
                    fileName: 'download.pdf',
                    loadPreviewData: function (cb) {
                        Ext.Ajax.request({
                            url: 'resources/data/sample.json',
                            success: function (res) {
                                var data = Ext.decode(res.responseText);
                                cb(data);
                            }
                        });
                    },
                    uploadFile: function (file) {
                        var formData = new FormData();
                        formData.append('file', file);

                        FileUtil.upload({
                            url: 'uploadFile',
                            formData: formData,
                            callback: function () {
                                // TODO:
                            }
                        })
                    }
                }
            ],

        }).show();
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
