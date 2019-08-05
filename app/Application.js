/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('Template.Application', {
    extend: 'Ext.app.Application',

    name: 'Template',

    quickTips: false,
    platformConfig: {
        desktop: {
            quickTips: true
        }
    },

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

                            fetch('resources/html/template1.html')
                                .then(function (res) {
                                    return res.text();
                                })
                                .then(function (html) {

                                    doc.write(new Ext.XTemplate([
                                        html,
                                        {
                                            getValue: function (v) {
                                                return Ext.util.Format.number(v);
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
                                        }
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
                                        Html2pdfUtil.downloadFile(doc.querySelector('.WordSection1'));
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
                                    callback = function () {
                                        Html2pdfUtil.getFile(doc.querySelector('.WordSection1')).then(function (file) {
                                            debugger;
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
