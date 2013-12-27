/**
 * Roundcube-Plugin to paste images directly from clipboard
 *
 * A the time of writing this only works in google chrome
 *
 * For now, this is only a proof-of-concept, there a many hacks in the code
 * If you have any hints or suggestions, feel free to contact me.
 *
 * @author  Matthias Krauser <matthias@krauser.eu> @mat_krauser
 * @version 0.1a
 * @date    2013-12-10
 * @license GPL
 *
 */

$(document).ready(function() {
    if (window.rcmail) {

        tinyMCE.onAddEditor.add(function(manager, editor) {
            editor.onPaste.add(function(editor, event) {
                var items = (event.clipboardData || event.originalEvent.clipboardData).items;
                if (items.length == 1 && items[0].type.indexOf('image') == 0) {
                    var f = items[0].getAsFile();
                    var reader = new FileReader();

                    // inline function to submit the files to the server
                    var submit_data = function() {
                        ts = new Date().getTime();
                        content = '<span>' + f.filename + '</span>'; // replace tempname

                        // add to attachments list
                        if (!rcmail.add2attachment_list(ts, {name: '', html: content, classname: 'uploading', complete: false}))
                            rcmail.file_upload_id = rcmail.set_busy(true, 'uploading');

                        // complete multipart content and post request
                        multipart += dashdash + boundary + dashdash + crlf;

                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            url: rcmail.url(rcmail.env.filedrop.action, {_id: rcmail.env.compose_id || rcmail.env.cid || '', _uploadid: ts, _remote: 1}),
                            contentType: formdata ? false : 'multipart/form-data; boundary=' + boundary,
                            processData: false,
                            timeout: 0, // disable default timeout set in ajaxSetup()
                            data: formdata,
                            headers: {'X-Roundcube-Request': rcmail.env.request_token},
                            xhr: function() {
                                var xhr = jQuery.ajaxSettings.xhr();
                                return xhr;
                            },
                            success: function(data) {
                                rcmail.http_response(data);

                                file_id = data.exec.substr(data.exec.indexOf('(') + 2, data.exec.substr(data.exec.indexOf('(') + 2).indexOf('"'));
                                args =  {
                                    src: "./?_task=mail&_action=display-attachment&_file=" + file_id + "&_id=" + rcmail.env.compose_id
                                }
                                el = editor.dom.createHTML('img', args);
                                editor.execCommand('mceInsertContent', false, el, {skip_undo : 1});

                            },
                            error: function(o, status, err) {
                                rcmail.http_error(o, status, err, null, 'attachment');
                            }
                        });
                    };

                    formdata = window.FormData ? new FormData() : null;
                    fieldname = (rcmail.env.filedrop.fieldname || '_file') + '[]';
                    boundary = '------multipartformboundary' + (new Date).getTime();
                    dashdash = '--', crlf = '\r\n';
                    multipart = dashdash + boundary + crlf;

                    // do it the easy way with FormData (FF 4+, Chrome 5+, Safari 5+)
                    f.filename = "pasted_image" + (new Date).getTime() + "." + f.type.substr(6);
                    formdata.append(fieldname, f, f.filename);
                    return submit_data();
                };
            });
        });
    }
});