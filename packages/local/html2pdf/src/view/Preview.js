Ext.define('Html2pdf.view.Preview', {
    requires: [
        'Html2pdf.Renderer'
    ],
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    config: {
        template: null,
        fileName: 'pdf.pdf',
        selector: '.Content'
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
                        win = me.getWin(),
                        template = parent.getTemplate(),
                        templateConfig;

                    if (Ext.isString(template)) {
                        template = {
                            url: template
                        }
                    }
                    if (!Ext.isObject(template)) {
                        Ext.log.error('Wrong Template config');
                        return;
                    }
                    templateConfig = template['config'] = (template['config'] || {});
                    Ext.apply(templateConfig, Html2pdfRenderer.getRenderer());

                    if (Ext.isFunction(parent.loadPreviewData)) {
                        parent.loadPreviewData(function (data) {
                            if (data) {
                                Html2pdfUtil.loadLibToIframe({
                                    window: win,
                                    template: template,
                                    data: data
                                })
                            }
                        });
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
                        var panel = btn.up('panel').down('uxiframe'),
                            parent = panel.up('panel'),
                            doc = panel.getDoc();

                        Html2pdfUtil.downloadFile({
                            element: doc.querySelector(parent.getSelector()),
                            fileName: parent.getFileName(),
                            window: panel.getWin()
                        });
                    }
                },
                {
                    xtype: 'button',
                    text: 'E-mail',
                    handler: function (btn) {
                        var panel = btn.up('panel').down('uxiframe'),
                            parent = panel.up('panel'),
                            doc = panel.getDoc();

                        Html2pdfUtil.downloadFile({
                            element: doc.querySelector(parent.getSelector()),
                            fileName: parent.getFileName(),
                            window: panel.getWin()
                        });
                    }
                }
            ]
        }
    ]
});