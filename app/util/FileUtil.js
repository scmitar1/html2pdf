Ext.define('Template.util.FileUtil', {
    alternateClassName: 'FileUtil',
    singleton: true,

    createReq: function (url) {
        var xhr = new XMLHttpRequest();
        if (typeof xhr['withCredentials'] === 'boolean') {
            xhr.open('POST', url, true);
        } else if (typeof XDomainRequest != 'undefined') {
            xhr = new XDomainRequest();
        } else {
            xhr = null;
        }
        return xhr;
    },

    /**
     * 파일 업로드
     * @param cfg
     *  - url(required): url(String)
     *  - formData: formData(FormData)
     *  - callback: callback(String/Function)
     *  - scope(required): scope(Ext.Component/Ext.app.ViewControlller)
     * */
    upload: function (cfg) {
        var url = cfg['url'],
            formData = cfg['formData'],
            callback = cfg['callback'],
            scope = cfg['scope'],
            xhr, wait, fn, ret;

        if (url) {
            xhr = this.createReq(url);
            xhr.withCredentials = true;
            xhr.onload = function () {
                wait && wait.hide();

                if (this.status === 200) {
                    ret = Ext.decode(this.response);

                    if (callback) {
                        if (Ext.isString(callback)) {
                            if (scope) {
                                fn = scope.isController ? scope[callback] : scope.isComponent
                                    ? scope.lookupController(true)[callback] : null;
                            }
                        } else if (Ext.isFunction(callback)) {
                            fn = callback;
                        }

                        fn && fn(ret);
                    }
                }
            };

            xhr.send(formData);
        }
    },

    /**
     *  파일 다운 로드
     *  @param cfg
     *   - param: param
     *   - fileName: 파일 이름
     *   - url: 다운로드 url
     *   - callback: 콜백 함수
     */
    fileDownload: function (cfg) {
        var formData = new FormData(),
            fileName = cfg['fileName'],
            url = cfg['url'],
            param = cfg['param'],
            xhr = this.createReq(),
            callback = cfg['callback'];

        Ext.Object.each(param, function (k, v) {
            if (Ext.isPrimitive(v)) {
                formData.append(k, v);
            }
        });

        xhr.withCredentials = true;
        xhr.open('POST', encodeURI(url));
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            if (callback) {
                callback();
            }
            if (this.status === 200) {
                var type = xhr.getResponseHeader('Content-Type');

                var blob = new Blob([this.response], {
                    type: type
                });
                if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    window.navigator.msSaveBlob(blob, fileName);
                } else {
                    var URL = window.URL || window.webkitURL;
                    var downloadUrl = URL.createObjectURL(blob);

                    if (fileName) {
                        // use HTML5 a[download] attribute to specify filename
                        var a = document.createElement("a");
                        // safari doesn't support this yet
                        if (typeof a.download === 'undefined') {
                            window.location = downloadUrl;
                        } else {
                            a.href = downloadUrl;
                            a.download = fileName;
                            document.body.appendChild(a);
                            a.click();
                        }
                    } else {
                        window.location = downloadUrl;
                    }

                    setTimeout(function () {
                        URL.revokeObjectURL(downloadUrl);
                    }, 100); // cleanup
                }
            } else {
                Ext.Msg.show({
                    title: 'WARNING',
                    message: 'Download Failed',
                    icon: Ext.Msg.WARNING,
                    buttons: Ext.Msg.OK
                });
            }
        };
        xhr.send(formData);
    }
});