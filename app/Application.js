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
                    xtype: 'uxiframe',
                    src: 'about:blank',
                    listeners: {
                        afterrender: function () {
                            var me = this,
                                doc = me.getDoc();

                            fetch('resources/html/template2.html')
                                .then(function (res) {
                                    return res.text();
                                })
                                .then(function (html) {

                                    doc.write(new Ext.XTemplate([
                                        html,
                                        {
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
                                    ]).apply({
                                        //On-board Handling Charge
                                        BASIC: {
                                            DISCHARGING: {
                                                QTY: 0,
                                                CBM: 0,
                                                RT: 0,
                                                RATE: 1244,
                                                AMOUNT: 123456,
                                                RMK: 'TEST'
                                            },
                                            LOADING: {
                                                QTY: 1,
                                                CBM: 1,
                                                RT: 1,
                                                RATE: 12441,
                                                AMOUNT: 1234561,
                                                RMK: 'TEST1'
                                            },
                                            TS_CHARGING: {
                                                QTY: 2,
                                                CBM: 2,
                                                RT: 2,
                                                RATE: 12441,
                                                AMOUNT: 1234561,
                                                RMK: 'TEST1'
                                            },
                                            TS_LOADING: {
                                                QTY: 3,
                                                CBM: 3,
                                                RT: 3,
                                                RATE: 12441,
                                                AMOUNT: 1234561,
                                                RMK: 'TEST1'
                                            },
                                            '1TIME': {
                                                QTY: 4,
                                                CBM: 4,
                                                RT: 4,
                                                RATE: 12441,
                                                AMOUNT: 1234561,
                                                RMK: 'TEST1'
                                            }
                                        },
                                        STORAGE_CHARGE: [
                                            {
                                                ITM: 'Over Storage Charge',
                                                TYPE: 'Small Size',
                                                QTY: 1,
                                                OVER_DAY: 1,
                                                RATE: 1,
                                                AMT: 1000,
                                                RMK: 'TEST'
                                            },
                                            {
                                                ITM: 'Over Storage Charge',
                                                TYPE: 'Mild Size',
                                                QTY: 2,
                                                OVER_DAY: 2,
                                                RATE: 2,
                                                AMT: 2000,
                                                RMK: 'TEST2'
                                            },
                                        ]
                                    }));
                                });
                        }
                    },
                }
            ],
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        '->',
                        {
                            xtype: 'button',
                            text: 'Print',
                            handler: function (btn) {
                                var panel = btn.up('window').down('uxiframe'),
                                    win = panel.getWin();

                                win.print();
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'PDF',
                            handler: function (btn) {
                                var pkgNm = 'html2pdf',
                                    panel = btn.up('window').down('uxiframe'),
                                    doc = panel.getDoc(),
                                    callback = function () {
                                        Html2pdfUtil.downloadFile({
                                            element: doc.querySelector('.WordSection1'),
                                            fileName: 'download.pdf'
                                        });
                                    };

                                if (!Ext.Package.isLoaded(pkgNm)) {
                                    Ext.Package.load(pkgNm)
                                        .then(function () {
                                            callback();
                                        });
                                } else {
                                    callback();
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            text: 'E-mail',
                            handler: function (btn) {
                                var pkgNm = 'html2pdf',
                                    panel = btn.up('window').down('uxiframe'),
                                    doc = panel.getDoc(),
                                    formData,
                                    callback = function () {
                                        Html2pdfUtil.getFile({
                                            element: doc.querySelector('.WordSection1'),
                                            fileName: 'download.pdf'
                                        }).then(function (file) {
                                            formData = new FormData();
                                            formData.append('file', file);

                                            FileUtil.upload({
                                                url: 'uploadFile',
                                                formData: formData,
                                                callback: function () {
                                                    // TODO:
                                                }
                                            })
                                        });
                                    };

                                callback();
                            }
                        }
                    ]
                }
            ]
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
