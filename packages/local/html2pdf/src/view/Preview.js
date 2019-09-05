Ext.define('Html2pdf.view.Preview', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    config: {
        template: null,
        fileName: 'pdf.pdf'
    },
    loadPreviewData: Ext.emptyFn,
    uploadFile: Ext.emptyFn,
    items: [
        {
            xtype: 'uxiframe',
            listeners: {
                afterrender: function () {
                    var me = this,
                        parent = me.up('panel'),
                        pkgNm = 'html2pdf',
                        win = me.getWin(),
                        callback = function () {
                            if (Ext.isFunction(parent.loadPreviewData)) {
                                parent.loadPreviewData(function (data) {
                                    if (data) {
                                        Html2pdfUtil.loadLibToIframe({
                                            window: win,
                                            template: parent.getTemplate(),
                                            data: data
                                        })
                                    }
                                });
                            }
                        };

                    if (Ext.Package && !Ext.Package.isLoaded(pkgNm)) {
                        Ext.Package.load(pkgNm)
                            .then(function () {
                                callback();
                            });
                    } else {
                        callback();
                    }
                }
            }
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
                        var panel = btn.up('panel').down('uxiframe'),
                            win = panel.getWin();

                        win.print();
                    }
                },
                {
                    xtype: 'button',
                    text: 'PDF',
                    handler: function (btn) {
                        var pkgNm = 'html2pdf',
                            panel = btn.up('panel').down('uxiframe'),
                            parent = panel.up('panel'),
                            doc = panel.getDoc(),
                            callback = function () {
                                Html2pdfUtil.downloadFile({
                                    element: doc.querySelector('.Content'),
                                    fileName: parent.getFileName(),
                                    window: panel.getWin()
                                });
                            };

                        if (Ext.Package && !Ext.Package.isLoaded(pkgNm)) {
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
                            panel = btn.up('panel').down('uxiframe'),
                            parent = panel.up('panel'),
                            doc = panel.getDoc(),

                            callback = function () {
                                Html2pdfUtil.getFile({
                                    element: doc.querySelector('.Content'),
                                    fileName: parent.getFileName(),
                                    window: panel.getWin(),
                                }).then(function (file) {
                                    if (Ext.isFunction(parent.uploadFile)) {
                                        parent.uploadFile(file);
                                    }
                                });
                            };

                        if (Ext.Package && !Ext.Package.isLoaded(pkgNm)) {
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
});