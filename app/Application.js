/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('Template.Application', {
    extend: 'Ext.app.Application',

    name: 'Template',

    requires: [
        'Template.*',
        'Html2pdf.*'
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
                    template: 'resources/html/template3.html',
                    selector: '.Content',
                    fileName: 'download.pdf',
                    loadPreviewData: function (cb) {
                        Ext.Ajax.request({
                            url: 'resources/data/sample3.json',
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
