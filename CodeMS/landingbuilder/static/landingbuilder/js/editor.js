var editor;
var code_editor;
var state = 1;
var current_html;
var current_version = 0;
var max_version;
var max_subversion;
var min_version = 1;

$(document).ready(function () {
    jQuery.fn.rotate = function (degrees) {
        $(this).css({
            '-webkit-transform': 'rotate(' + degrees + 'deg)',
            '-moz-transform': 'rotate(' + degrees + 'deg)',
            '-ms-transform': 'rotate(' + degrees + 'deg)',
            'transform': 'rotate(' + degrees + 'deg)'
        });
        return $(this);
    };

    var rotate = 0;

    $('#show_button').click(function () {
        console.log("§asdölfkj");
        $('#admin_panel').slideToggle('slow');
        if (rotate == 0) {
            rotate = 180;
            $(this).rotate(rotate);
        } else {
            rotate = 0;
            $(this).rotate(rotate);
        }
    });

    const normal = 1;
    const code = 2;
    const builder = 3;

    $.ajax({
        method: 'GET', 
        url: '/get_page/' + page_id + '/'+ current_version+ '/',
        success: function (data) {
            current_html = data['html'];
            $('#site').html(current_html);
            var v = data['version'];
            var sv = data['subversion'];
            current_version = v;
            max_version = v;
            max_subversion = sv;
            $('#revision').text('v.'+v+'.'+sv);
        }
    });

    $.ajax({ method: 'GET', url: '/api/pages/' + page_id + '/', success: function (data) { $('#admin_checkbox').prop('checked', data.admin) } })

    $('#admin_checkbox').change(function () {
        if (this.checked) {
            $.ajax({
                method: 'PATCH', url: '/api/pages/' + page_id + '/', data: {
                    'admin': true
                }, beforeSend: function (xhr, settings) {
                    xhr.setRequestHeader("X-CSRFToken", token);
                }, succes: function (data) { console.log(data); }
            });
        } else {
            $.ajax({
                method: 'PATCH', url: '/api/pages/' + page_id + '/', data: {
                    'admin': false
                }, beforeSend: function (xhr, settings) {
                    xhr.setRequestHeader("X-CSRFToken", token);
                }, succes: function (data) { console.log(data); }
            });
        }
    });


    $('#builder_editorbutton').click(function () {
        init_builder();
    });

    function init_code(){
        $('link[rel=stylesheet][href*="materialize"]').remove();
        $('#content').css('display', 'none');
        $('#site').css('display', 'none');
        $('#editor').css('display', 'block');


        $('#builder_editorbutton').removeClass('selected');
        $('#builder_editorbutton').addClass('not_selected');
        $('#normal').addClass('not_selected');
        $('#normal').removeClass('selected');
        $('#code_editorbutton').removeClass('not_selected');
        $('#code_editorbutton').addClass('selected');

        state = code;

        $.ajax({
            method: 'GET', url: '/get_page/' + page_id + '/'+current_version+"/",
            success: function (data) {
                code_editor = ace.edit('editor');
                code_editor.setTheme("ace/theme/monokai");
                code_editor.$blockScrolling = Infinity;
                var val = html_beautify(data['html']);
                code_editor.setValue(val, -1);
                code_editor.getSession().setMode("ace/mode/html");
                console.log(code_editor.getValue());
                //editor.getSession().setUseWrapMode(true);
            }
        });
    }

    $('#code_editorbutton').click(function () {
        init_code();
    });

    function init_normal(){
        $("head link[rel='stylesheet']").last().after("<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css' type='text/css'>");
        $('#content').css('display', 'none');
        $('#editor').css('display', 'none');
        $('#site').css('display', 'block');

        $('#builder_editorbutton').removeClass('selected');
        $('#builder_editorbutton').addClass('not_selected');
        $('#normal').addClass('selected');
        $('#normal').removeClass('not_selected');
        $('#code_editorbutton').removeClass('selected');
        $('#code_editorbutton').addClass('not_selected');

        state = normal;

        $.ajax({
            method: 'GET', url: '/get_page/' + page_id + '/' + current_version+ '/',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({ 'v': current_version }),
            beforeSend: function (xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", token);
            },
            success: function (data) {
                $('#site').html(data['html']);
            }
        });
    }

    $('#normal').click(function () {
        init_normal();
    });

    $('#version_forward').click(function () {
        if(current_version < max_version){
            current_version++;
            $('#version_back').removeClass('deactivate_chevron');
            if(current_version == max_version){
                $('#save').removeClass('d_save');
                $('#revision').text('v.'+max_version+'.'+max_subversion);
                $('#version_forward').addClass('deactivate_chevron');
            }else{
                $('#revision').text('v.'+current_version);
            }
            re_init();
        }
    });

    $('#version_back').click(function () {
        if(current_version > min_version){
            $('#version_forward').removeClass('deactivate_chevron');
            current_version--;
            $('#save').addClass('d_save');
            $('#revision').text('v.'+current_version);
            if(current_version == min_version){
                $('#version_back').addClass('deactivate_chevron');
            }
            re_init();
        }
    });

    function re_init(){
        if(state == code){
            init_code();
        }

        if(state == builder){
            init_builder();
        }

        if(state == normal){
            init_normal();
        }
    }

    $('#save').click(function () {
        save();
    });

    $('#save_new_version').click(function () {
        if(confirm("neue Version anlegen")){
            save(true);
        }
    });

    function save(n) {
        
        if (typeof(n)==='undefined') n = false;

        if(current_version != max_version){
            n = true;
        }

        var data;

        if (state == builder) {
            var css = editor.getCss();

            data = editor.getHtml() + "<style>" + css + "</style>";
        }

        if (state == code) {
            data = code_editor.getValue();
        }

        if (state == normal){
            data =  $('#site').html();
        }

        if (data != null && data != current_html || current_version != max_version) {
            current_html = data;
            $.ajax({
                type: "POST",
                url: '/save_page/' + page_id + '/',
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify({'html':data, 'new': n}),
                beforeSend: function (xhr, settings) {
                    xhr.setRequestHeader("X-CSRFToken", token);
                },
                success: function (data) {
                    //$( "#weather-temp" ).html( "<strong>" + result + "</strong> degrees" );
                    console.log(data);
                    var v = data['version'];
                    var sv = data['subversion'];
                    max_subversion = sv;
                    max_version = v;
                    current_version = v;
                    $('#version_forward').addClass('deactivate_chevron');
                    $('#version_back').removeClass('deactivate_chevron');
                    $('#revision').text('v.'+v+'.'+sv);
                    re_init();
                }
            });
        }


    }

    function init_builder(){
        $('link[rel=stylesheet][href*="materialize"]').remove();
        state = builder;
    
        $('#content').css('display', 'block');
        $('#editor').css('display', 'none');
        $('#site').css('display', 'none');
    
        $.ajax({
            method: 'GET', url: '/get_page/' + page_id + '/'+ current_version+ '/',
            success: function (data) {
                $('#content').html(data['html']);
                editor = grapesjs.init({
                    showOffsets: 1,
                    forceClass: false,
                    container: '#content',
                    height: '100vh',
                    width: 'auto',
                    fromElement: true,
                    allowScripts: 1,
                    plugins: ['grapesjs-style-gradient','grapesjs-parser-postcss'],
                    pluginsOpts: {
                        'grapesjs-style-gradient': {
                            colorPicker: 'default',
                            grapickOpts: {
                                min: 1,
                                max: 99,
                            }
                        },
                    },
                    storageManager: false,
                    canvas: {
                        styles: ['https://fonts.googleapis.com/css?family=Roboto',
                            'https://fonts.googleapis.com/icon?family=Material+Icons',
                            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
                            'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
                            'https://unpkg.com/materialize-stepper@3.1.0/dist/css/mstepper.min.css'],
                        scripts: ['https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js',
                            'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.js',
                            'https://unpkg.com/materialize-stepper@3.1.0/dist/js/mstepper.min.js']
                    },
                    commands: {
                        defaults: [
                            {
                                id: 'undo',
                                run: function (editor, sender) {
                                    sender.set('active', false);
                                    editor.UndoManager.undo(true);
                                }
                            }, {
                                id: 'redo',
                                run: function (editor, sender) {
                                    sender.set('active', false);
                                    editor.UndoManager.redo(true);
                                }
                            }, {
                                id: 'clean-all',
                                run: function (editor, sender) {
                                    sender.set('active', false);
                                    if (confirm('Are you sure to clean the canvas?')) {
                                        var comps = editor.DomComponents.clear();
                                    }
                                }
                            },
                        ],
                    },
                    assetManager: {
                        upload: 'https://test.page',
                        params: {
                            _token: 'pCYrSwjuiV0t5NVtZpQDY41Gn5lNUwo3it1FIkAj',
                        },
                        assets: [
                            {
                                type: 'image',
                                src: 'https://res.cloudinary.com/ronaldaug/image/upload/v1515419443/background_ckgyqe.jpg',
                                date: '2015-02-01',
                                height: 808,
                                width: 1440
                            },
                            {
                                type: 'image',
                                src: 'https://res.cloudinary.com/ronaldaug/image/upload/v1515419441/background2_gjvaxs.jpg',
                                date: '2015-02-01',
                                height: 800,
                                width: 1600
                            },
                            {
                                type: 'image',
                                src: 'https://res.cloudinary.com/ronaldaug/image/upload/v1515419443/background3_d0ghix.jpg',
                                date: '2015-02-01',
                                height: 743,
                                width: 1440
                            },
                            {
                                type: 'image',
                                src: 'https://res.cloudinary.com/ronaldaug/image/upload/v1515419446/background4_pzh5ou.jpg',
                                date: '2015-02-01',
                                height: 808,
                                width: 1440
                            },
                            {
                                type: 'image',
                                src: 'http://via.placeholder.com/250x350/0174DF/ffffff/',
                                height: 350,
                                width: 250
                            },
                            {
                                type: 'image',
                                src: 'http://via.placeholder.com/250x350/5FB404/ffffff/',
                                height: 350,
                                width: 250
                            },
                            {
                                type: 'image',
                                src: 'http://via.placeholder.com/250x350/BF00FF/ffffff/',
                                height: 350,
                                width: 250
                            },
                            {
                                type: 'image',
                                src: 'http://via.placeholder.com/250x350/B40431/ffffff/',
                                height: 350,
                                width: 250
                            },
                            {
                                type: 'image',
                                src: 'http://via.placeholder.com/250x350/088A68/ffffff/',
                                height: 350,
                                width: 250
                            },
                            {
                                type: 'image',
                                src: 'http://via.placeholder.com/250x350/DF7401/ffffff/',
                                height: 350,
                                width: 250
                            },
                            {
                                type: 'image',
                                src: 'http://via.placeholder.com/250x350/00BFFF/ffffff/',
                                height: 350,
                                width: 250
                            }
                        ]
                    },
                    blockManager: {
                        blocks: []
                    },
                    styleManager: {
                        sectors: [{
                            name: 'General',
                            buildProps: ['vertical-align', 'z-index', 'float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
                            properties: [
                                {
                                    name: 'Vertical Alignment',
                                    property: 'vertical-align',
                                    type: 'select',
                                    defaults: 'none',
                                    list: [
                                        { name: 'baseline', value: 'baseline' },
                                        { name: 'top', value: 'top' },
                                        { name: 'middle', value: 'middle' },
                                        { name: 'bottom', value: 'bottom' },
                                        { name: 'middle', value: 'middle' },
                                        { name: 'inherit', value: 'inherit' },
                                        { name: 'initial', value: 'initial' }
                                    ],
                                }, {
                                    name: 'Alignment',
                                    property: 'float',
                                    type: 'radio',
                                    defaults: 'none',
                                    list: [
                                        { value: 'none', className: 'fa fa-times' },
                                        { value: 'left', className: 'fa fa-align-left' },
                                        { value: 'right', className: 'fa fa-align-right' }
                                    ],
                                },
                                {
                                    name: 'Display',
                                    property: 'display',
                                    type: 'select',
                                    defaults: 'none',
                                    list: [
                                        { value: 'block', name: 'block' },
                                        { value: 'inline', name: 'inline' },
                                        { value: 'inline-block', name: 'inline-block' },
                                        { value: 'table-cell', name: 'table-cell' },
                                        { value: 'table', name: 'table' }
                                    ],
                                },
                                {
                                    name: 'Position',
                                    property: 'position',
                                    type: 'select',
                                    defaults: 'none',
                                    list: [
                                        { value: 'static', name: 'static' },
                                        { value: 'relative', name: 'relative' },
                                        { value: 'absolute', name: 'absolute' },
                                        { value: 'sticky', name: 'sticky' },
                                        { value: 'fixed', name: 'fixed' }
                                    ],
                                }
                            ],
                        }, {
                            name: 'Dimension',
                            open: false,
                            buildProps: ['overflow', 'width', 'flex-width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
                            properties: [{
                                id: 'flex-width',
                                type: 'integer',
                                name: 'Width',
                                units: ['px', '%'],
                                property: 'flex-basis',
                                toRequire: 1,
                            }, {
                                property: 'overflow',
                                properties: [
                                    { name: 'visible', property: 'visible' },
                                    { name: 'hidden', property: 'hidden' },
                                    { name: 'scroll', property: 'scroll' },
                                    { name: 'auto', property: 'auto' },
                                    { name: 'initial', property: 'initial' },
                                    { name: 'inherit', property: 'inherit' }
                                ],
                            }, {
                                property: 'margin',
                                properties: [
                                    { name: 'Top', property: 'margin-top' },
                                    { name: 'Right', property: 'margin-right' },
                                    { name: 'Bottom', property: 'margin-bottom' },
                                    { name: 'Left', property: 'margin-left' }
                                ],
                            }, {
                                property: 'padding',
                                properties: [
                                    { name: 'Top', property: 'padding-top' },
                                    { name: 'Right', property: 'padding-right' },
                                    { name: 'Bottom', property: 'padding-bottom' },
                                    { name: 'Left', property: 'padding-left' }
                                ],
                            }],
                        }, {
                            name: 'Typography',
                            open: false,
                            buildProps: ['white-space', 'text-overflow', 'font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align', 'text-decoration', 'text-shadow'],
                            properties: [
                                {
                                    name: 'Font', property: 'font-family', type: 'select', defaults: 'Roboto', list: [
                                        { value: "Roboto", name: "Roboto" },
                                        { value: "'Oswald', sans-serif", name: 'Oswald' },
                                        { value: "Helvetica Neue,Helvetica,Arial,sans-serif", name: 'Helvetica' },
                                        { value: "sans-serif", name: 'sans-serif' },
                                        { value: "Times New Roman", name: 'Times New Roman' },
                                        { value: "Arial Black", name: 'Arial Black' },
                                        { value: "Tahoma", name: 'Tahoma' },
                                        { value: "Verdana, Geneva, sans-serif", name: 'Verdana' },
                                        { value: "Courier New Courier, monospace", name: 'Courier New Courier' },
                                        { value: "'Lato', sans-serif", name: 'Lato' },
                                        { value: "'Open Sans', sans-serif", name: 'Open Sans' },
                                        { value: "'Montserrat', sans-serif", name: 'Montserrat' }
                                    ]
                                },
                                { name: 'Weight', property: 'font-weight' },
                                { name: 'Font color', property: 'color' },
                                {
                                    property: 'white-space',
                                    type: 'select',
                                    list: [
                                        { value: 'nowrap', name: 'nowrap' },
                                        { value: 'normal', name: 'normal' },
                                        { value: 'pre', name: 'pre' }
                                    ],
                                },
                                {
                                    property: 'text-overflow',
                                    type: 'select',
                                    list: [
                                        { value: 'clip', name: 'clip' },
                                        { value: 'ellipsis', name: 'ellipsis' },
                                        { value: 'initial', name: 'initial' },
                                        { value: 'inherit', name: 'inherit' }
                                    ],
                                },
                                {
                                    property: 'text-align',
                                    type: 'radio',
                                    defaults: 'left',
                                    list: [
                                        { value: 'left', name: 'Left', className: 'fa fa-align-left' },
                                        { value: 'center', name: 'Center', className: 'fa fa-align-center' },
                                        { value: 'right', name: 'Right', className: 'fa fa-align-right' },
                                        { value: 'justify', name: 'Justify', className: 'fa fa-align-justify' }
                                    ],
                                }, {
                                    property: 'text-decoration',
                                    type: 'radio',
                                    defaults: 'none',
                                    list: [
                                        { value: 'none', name: 'None', className: 'fa fa-times' },
                                        { value: 'underline', name: 'underline', className: 'fa fa-underline' },
                                        { value: 'line-through', name: 'Line-through', className: 'fa fa-strikethrough' }
                                    ],
                                }, {
                                    property: 'text-shadow',
                                    properties: [
                                        { name: 'X position', property: 'text-shadow-h' },
                                        { name: 'Y position', property: 'text-shadow-v' },
                                        { name: 'Blur', property: 'text-shadow-blur' },
                                        { name: 'Color', property: 'text-shadow-color' }
                                    ],
                                }],
                        }, {
                            name: 'Decorations',
                            open: false,
                            buildProps: ['opacity', 'background-color', 'border-radius', 'border', 'box-shadow', 'background'],
                            properties: [{
                                type: 'slider',
                                property: 'opacity',
                                defaults: 1,
                                step: 0.01,
                                max: 1,
                                min: 0,
                            }, {
                                property: 'border-radius',
                                properties: [
                                    { name: 'Top', property: 'border-top-left-radius' },
                                    { name: 'Right', property: 'border-top-right-radius' },
                                    { name: 'Bottom', property: 'border-bottom-left-radius' },
                                    { name: 'Left', property: 'border-bottom-right-radius' }
                                ],
                            }, {
                                property: 'box-shadow',
                                properties: [
                                    { name: 'X position', property: 'box-shadow-h' },
                                    { name: 'Y position', property: 'box-shadow-v' },
                                    { name: 'Blur', property: 'box-shadow-blur' },
                                    { name: 'Spread', property: 'box-shadow-spread' },
                                    { name: 'Color', property: 'box-shadow-color' },
                                    { name: 'Shadow type', property: 'box-shadow-type' }
                                ],
                            }, {
                                property: 'background',
                                properties: [
                                    { name: 'Image', property: 'background-image' },
                                    { name: 'Repeat', property: 'background-repeat' },
                                    { name: 'Repeat-y', property: 'background-repeat-y' },
                                    { name: 'Repeat-x', property: 'background-repeat-x' },
                                    { name: 'Position', property: 'background-position' },
                                    { name: 'Attachment', property: 'background-attachment' },
                                    { name: 'Size', property: 'background-size' }
                                ],
                            },],
                        }, {
                            name: 'Extra',
                            open: false,
                            buildProps: ['transition', 'perspective', 'transform'],
                            properties: [{
                                property: 'transition',
                                properties: [
                                    { name: 'Property', property: 'transition-property' },
                                    { name: 'Duration', property: 'transition-duration' },
                                    { name: 'Easing', property: 'transition-timing-function' }
                                ],
                            }, {
                                property: 'transform',
                                properties: [
                                    { name: 'Rotate X', property: 'transform-rotate-x' },
                                    { name: 'Rotate Y', property: 'transform-rotate-y' },
                                    { name: 'Rotate Z', property: 'transform-rotate-z' },
                                    { name: 'Scale X', property: 'transform-scale-x' },
                                    { name: 'Scale Y', property: 'transform-scale-y' },
                                    { name: 'Scale Z', property: 'transform-scale-z' }
                                ],
                            }]
                        }, {
                            name: 'Flex',
                            open: false,
                            properties: [{
                                name: 'Flex Container',
                                property: 'display',
                                type: 'select',
                                defaults: 'block',
                                list: [
                                    { value: 'block', name: 'Disable' },
                                    { value: 'flex', name: 'Enable' }
                                ],
                            }, {
                                name: 'Flex Parent',
                                property: 'label-parent-flex',
                                type: 'integer',
                            }, {
                                name: 'Direction',
                                property: 'flex-direction',
                                type: 'radio',
                                defaults: 'row',
                                list: [{
                                    value: 'row',
                                    name: 'Row',
                                    className: 'icons-flex icon-dir-row',
                                    title: 'Row',
                                }, {
                                    value: 'row-reverse',
                                    name: 'Row reverse',
                                    className: 'icons-flex icon-dir-row-rev',
                                    title: 'Row reverse',
                                }, {
                                    value: 'column',
                                    name: 'Column',
                                    title: 'Column',
                                    className: 'icons-flex icon-dir-col',
                                }, {
                                    value: 'column-reverse',
                                    name: 'Column reverse',
                                    title: 'Column reverse',
                                    className: 'icons-flex icon-dir-col-rev',
                                }],
                            }, {
                                name: 'Justify',
                                property: 'justify-content',
                                type: 'radio',
                                defaults: 'flex-start',
                                list: [{
                                    value: 'flex-start',
                                    className: 'icons-flex icon-just-start',
                                    title: 'Start',
                                }, {
                                    value: 'flex-end',
                                    title: 'End',
                                    className: 'icons-flex icon-just-end',
                                }, {
                                    value: 'space-between',
                                    title: 'Space between',
                                    className: 'icons-flex icon-just-sp-bet',
                                }, {
                                    value: 'space-around',
                                    title: 'Space around',
                                    className: 'icons-flex icon-just-sp-ar',
                                }, {
                                    value: 'center',
                                    title: 'Center',
                                    className: 'icons-flex icon-just-sp-cent',
                                }],
                            }, {
                                name: 'Align',
                                property: 'align-items',
                                type: 'radio',
                                defaults: 'center',
                                list: [{
                                    value: 'flex-start',
                                    title: 'Start',
                                    className: 'icons-flex icon-al-start',
                                }, {
                                    value: 'flex-end',
                                    title: 'End',
                                    className: 'icons-flex icon-al-end',
                                }, {
                                    value: 'stretch',
                                    title: 'Stretch',
                                    className: 'icons-flex icon-al-str',
                                }, {
                                    value: 'center',
                                    title: 'Center',
                                    className: 'icons-flex icon-al-center',
                                }],
                            }, {
                                name: 'Flex Children',
                                property: 'label-parent-flex',
                                type: 'integer',
                            }, {
                                name: 'Order',
                                property: 'order',
                                type: 'integer',
                                defaults: 0,
                                min: 0
                            }, {
                                name: 'Flex',
                                property: 'flex',
                                type: 'composite',
                                properties: [{
                                    name: 'Grow',
                                    property: 'flex-grow',
                                    type: 'integer',
                                    defaults: 0,
                                    min: 0
                                }, {
                                    name: 'Shrink',
                                    property: 'flex-shrink',
                                    type: 'integer',
                                    defaults: 0,
                                    min: 0
                                }, {
                                    name: 'Basis',
                                    property: 'flex-basis',
                                    type: 'integer',
                                    units: ['px', '%', ''],
                                    unit: '',
                                    defaults: 'auto',
                                }],
                            }, {
                                name: 'Align',
                                property: 'align-self',
                                type: 'radio',
                                defaults: 'auto',
                                list: [{
                                    value: 'auto',
                                    name: 'Auto',
                                }, {
                                    value: 'flex-start',
                                    title: 'Start',
                                    className: 'icons-flex icon-al-start',
                                }, {
                                    value: 'flex-end',
                                    title: 'End',
                                    className: 'icons-flex icon-al-end',
                                }, {
                                    value: 'stretch',
                                    title: 'Stretch',
                                    className: 'icons-flex icon-al-str',
                                }, {
                                    value: 'center',
                                    title: 'Center',
                                    className: 'icons-flex icon-al-center',
                                }],
                            }]
                        }]
                    },
                    deviceManager: {
                        devices: [{
                            name: 'Desktop',
                            width: '', // default size
                        },{
                            name: 'Tablet',
                            width: '992px', // this value will be used on canvas width
                            widthMedia: '992px', // this value will be used in CSS @media
                        },{
                            name: 'Mobile',
                            width: '600px', // this value will be used on canvas width
                            widthMedia: '600px', // this value will be used in CSS @media
                        }]
                    },
                });

        
                editor.StyleManager.addProperty('decorations', {
                    name: 'Gradient',
                    property: 'background-image',
                    type: 'gradient',
                    defaults: 'none'
                }, 0);
    
                var blockManager = editor.BlockManager;

                blockManager.add('splitter-thick', {
                    label: 'Thick Splitter',
                    category: 'Layout',
                    content: '<div style="width: 7%;height: 0.5rem;"class="divider_thick amber darken-3"></div>',
                    attributes: {
                        class: 'fa fa-arrows-v'
                    }
                });
                blockManager.add('flow-text', {
                    label: 'Flow Text',
                    category: 'Basic',
                    content: '<p class="flow-text">This is Flow Text</p>',
                    attributes: {
                        class: 'fa fa-font'
                    }
                });
                blockManager.add('spacer', {
                    label: 'Space',
                    category: 'Layout',
                    content: '<div style="padding:1rem; margin:1rem; height:1rem;"></div>',
                    attributes: {
                        class: 'fa fa-arrows-v'
                    }
                });
                blockManager.add('logo', {
                    label: 'Logo',
                    category: 'Navigation',
                    content: `<a href="/" class="brand-logo left ">
                    <img style="height: 64px;
                    padding: 7px;" src="http://cdn.unterweisung-on-demand.de/KMS_Logos_white.png"><br>
                    </a>`,
                    attributes: {
                        class: 'fa fa-picture-o'
                    }
                });
                blockManager.add('nav-link', {
                    label: 'Navigation Link',
                    category: 'Navigation',
                    content: `<li><a href="collapsible.html">Link</a></li>`,
                    attributes: {
                        class: 'fa fa-link'
                    }
                });
                blockManager.add('nav-link-bar', {
                    label: 'Navigation Link Container',
                    category: 'Navigation',
                    content: `<ul id="nav-mobile" class="left hide-on-med-and-down">
                    <li><a href="sass.html">Link</a></li>
                  </ul>`,
                    attributes: {
                        class: 'fa fa-link'
                    }
                });
                blockManager.add('headline_1_light', {
                    label: 'Headline 1 light',
                    category: 'Basic',
                    content: '<h1 style="font-weight: 100;" id="head_light">Headline Light</h1>',
                    attributes: {
                        class: 'fa fa-font'
                    }
                });
                blockManager.add('3ba', {
                    label: 'Badges',
                    category: 'Section',
                    content: '<div class="section"><div class="container">'
                        + '<div class="row">'
                        + '<div class="col s12 m4">'
                        + '<div class="icon-block">'
                        + '<h2 class="center light-blue-text"><i class="material-icons badge-icon">flash_on</i></h2>'
                        + '<h5 class="center">Speeds up development</h5>'
    
                        + '<p class="light">We did most of the heavy lifting for you to provide a default stylings that incorporate our custom components. Additionally, we refined animations and transitions to provide a smoother experience for developers.</p>'
                        + '</div>'
                        + '</div>'
    
                        + '<div class="col s12 m4">'
                        + '<div class="icon-block">'
                        + '<h2 class="center light-blue-text"><i class="material-icons badge-icon">group</i></h2>'
                        + '<h5 class="center">User Experience Focused</h5>'
    
                        + '<p class="light">By utilizing elements and principles of Material Design, we were able to create a framework that incorporates components and animations that provide more feedback to users. Additionally, a single underlying responsive system across all platforms allow for a more unified user experience.</p>'
                        + '</div>'
                        + '</div>'
    
                        + '<div class="col s12 m4">'
                        + '<div class="icon-block">'
                        + '<h2 class="center light-blue-text"><i class="material-icons badge-icon">settings</i></h2>'
                        + '<h5 class="center">Easy to work with</h5>'
    
                        + '<p class="light">We have provided detailed documentation as well as specific code examples to help new users get started. We are also always open to feedback and can answer any questions a user may have about Materialize.</p>'
                        + '</div>'
                        + '</div>'
                        + '</div>'
                        + '</div>'
                        + '</div>'
                        + '<style>.badge-icon{font-size:30px}.icon-block{padding:0 15px}</style>',
                    attributes: {
                        class: 'fa fa-sitemap'
                    }
                });
                blockManager.add('text', {
                    label: 'Text',
                    attributes: {
                        class: 'fa fa-text-width'
                    },
                    category: 'Basic',
                    content: {
                        type: 'text',
                        content: 'Insert your text here',
                        activeOnRender: 1
                    },
                });
                blockManager.add('list', {
                    label: 'List',
                    category: 'Basic',
                    attributes: {
                        class: 'fa fa-bars'
                    },
                    content: `<ul class="collection">
                        <li class="collection-item">List One</li>
                        <li class="collection-item">List Two</li>
                        <li class="collection-item">List Three</li>
                        <li class="collection-item">List Four</li>
                        </ul>`,
                });
                blockManager.add('list2', {
                    label: 'List Two',
                    category: 'Basic',
                    attributes: {
                        class: 'fa fa-bars'
                    },
                    content: '<ul class="collection">'
                        + '<li class="collection-item avatar">'
                        + '<img src="https://randomuser.me/api/portraits/women/83.jpg" alt="" class="circle">'
                        + '<span class="title">Title</span>'
                        + '<p>First Line <br> Second Line </p>'
                        + '<a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>'
                        + '</li>'
                        + '<li class="collection-item avatar">'
                        + '<i class="material-icons circle">folder</i>'
                        + '<span class="title">Title</span>'
                        + '<p>First Line <br>Second Line</p>'
                        + '<a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>'
                        + '</li>'
                        + '<li class="collection-item avatar">'
                        + '<i class="material-icons circle green">insert_chart</i>'
                        + '<span class="title">Title</span>'
                        + '<p>First Line <br>Second Line</p>'
                        + '<a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>'
                        + '</li>'
                        + '<li class="collection-item avatar">'
                        + '<i class="material-icons circle red">play_arrow</i>'
                        + '<span class="title">Title</span>'
                        + '<p>First Line <br>Second Line</p>'
                        + '<a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>'
                        + '</li>'
                        + '</ul>',
                });
                blockManager.add('table', {
                    label: 'Table',
                    category: 'Basic',
                    attributes: {
                        class: 'fa fa-table'
                    },
                    content: '<table class="responsive-table centered striped highlight bordered">'
                        + '<thead>'
                        + '<tr>'
                        + '<th>Name</th>'
                        + '<th>Item Name</th>'
                        + '<th>Item Price</th>'
                        + '</tr>'
                        + '</thead>'
                        + '<tbody>'
                        + '<tr>'
                        + '<td>Alvin</td>'
                        + '<td>Eclair</td>'
                        + '<td>$0.87</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td>Alan</td>'
                        + '<td>Jellybean</td>'
                        + '<td>$3.76</td>'
                        + '</tr>'
                        + '<tr>'
                        + '<td>Jonathan</td>'
                        + '<td>Lollipop</td>'
                        + '<td>$7.00</td>'
                        + '</tr>'
                        + '</tbody>'
                        + '</table>',
                });
                blockManager.add('res', {
                    label: 'respon image',
                    category: 'Media',
                    content: '<img src="http://via.placeholder.com/250x250/0174DF/ffffff/" class="responsive-img">',
                    attributes: {
                        class: 'fa fa-image'
                    }
                });
                blockManager.add('cbtn', {
                    label: 'Circle Button',
                    category: 'Basic',
                    content: '<a class="btn-floating btn-large waves-effect waves-light orange"><i class="material-icons">add</i></a>',
                    attributes: {
                        class: 'fa fa-circle-thin'
                    }
                });
                blockManager.add('link', {
                    label: 'Link',
                    category: 'Basic',
                    attributes: {
                        class: 'fa fa-link'
                    },
                    content: {
                        type: 'link',
                        content: 'Link',
                    },
                });
                blockManager.add('members', {
                    label: 'Members',
                    category: 'Section',
                    content: `<section id="members">
        <div class="container">
        <div class="row">
        <div class="col m12">
        <h2 class="section-title center">Members</h2>
        </div>
        </div>
        <div class="row">
          <div class="col m4 s6">
        <div class="single-member">
          <img class="profile-img" src="https://randomuser.me/api/portraits/women/82.jpg" alt="">
        <h5>Marian Holmes</h5>
        <p>Developer</p>
        <ul class="social-icons">
          <li><a href="#"><img src="https://res.cloudinary.com/ronaldaug/image/upload/v1530271176/facebook_xufb3l.png" alt="facebook">
          <li><a href="#"><img src="https://res.cloudinary.com/ronaldaug/image/upload/v1530271176/twitter_cxpl2b.png" alt="twitter"></a></li>
          <li><a href="#"><img src="https://res.cloudinary.com/ronaldaug/image/upload/v1530271176/linkedin_vkgoom.png" alt="linkedin"></a></li>
        </ul>
        </div>
        </div>
         <div class="col m4 s6">
        <div class="single-member">
          <img class="profile-img" src="https://randomuser.me/api/portraits/women/74.jpg" alt="">
        <h5>Peggy Henry</h5>
        <p>Marketing manager</p>
        <ul class="social-icons">
          <li><a href="#"><img src="https://res.cloudinary.com/ronaldaug/image/upload/v1530271176/facebook_xufb3l.png" alt="facebook">
          <li><a href="#"><img src="https://res.cloudinary.com/ronaldaug/image/upload/v1530271176/twitter_cxpl2b.png" alt="twitter"></a></li>
          <li><a href="#"><img src="https://res.cloudinary.com/ronaldaug/image/upload/v1530271176/linkedin_vkgoom.png" alt="linkedin"></a></li>
        </ul>
        </div>
        </div>
          <div class="col m4 s6">
        <div class="single-member">
          <img class="profile-img" src="https://randomuser.me/api/portraits/men/13.jpg" alt="">
        <h5>Eduardo Carter</h5>
        <p>Director</p>
        <ul class="social-icons">
          <li><a href="#"><img src="https://res.cloudinary.com/ronaldaug/image/upload/v1530271176/facebook_xufb3l.png" alt="facebook">
          <li><a href="#"><img src="https://res.cloudinary.com/ronaldaug/image/upload/v1530271176/twitter_cxpl2b.png" alt="twitter"></a></li>
          <li><a href="#"><img src="https://res.cloudinary.com/ronaldaug/image/upload/v1530271176/linkedin_vkgoom.png" alt="linkedin"></a></li>
        </ul>
        </div>
        </div>
        </div>
        </div>
        </section>
        <style>section#members{width:100%;background:#f6f7f9;padding:40px 0 40px}.section-title{color:#262e41;margin:40px 0 40px}.single-member{background:#fff;padding:60px 20px 40px;text-align:center;border-radius:3px;transition:all ease .3s;-moz-transition:all ease .3s;-webkit-transition:all ease .3s}.single-member:hover{margin-top:-10px;box-shadow:0 1px 10px rgba(167,176,211,0.38);-moz-box-shadow:0 1px 10px rgba(167,176,211,0.38);-webkit-box-shadow:0 1px 10px rgba(167,176,211,0.38)}.single-member .profile-img{width:80px;height:80px;border-radius:100%;-moz-border-radius:100%;-webkit-border-radius:100%}.single-member h5{font-size:16px}.single-member p{font-size:12px;color:#777}ul.social-icons{width:100%}ul.social-icons li{display:inline-block}ul.social-icons li a{margin:10px}ul.social-icons li a img{width:20px;height:20px}</style>`,
                    attributes: {
                        class: "fa fa-users"
                    }
                });
                blockManager.add('michael', {
                    label: 'Über Mich',
                    category: 'Section',
                    content: `<section id="michael_schmidt">
                    <div class="container col s12 grey-text" style="margin-top: 5rem; margin-top: 5rem; margin-bottom: 10rem;">
    <div class="row">
        <br>
        <div class="col s12 m6">

            <div class="video-container" id="bio_video">
                <iframe src="https://www.youtube.com/embed/zim6UfnE2zU" frameborder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
            </div>
            <div class="indigo lighten-3 hide-on-small-only" id="shadow"></div>
            <br>
            <br>
        </div>

        <div class="col s12 m6" style="font-size: 1.3em;" id="bio_card">
            <div style="font-size: 1.3em;"><strong>Michael Schmidt</strong></div>
            <br>
            <div class="amber darken-3" style=" width: 7%;
            height: 0.5rem;"></div>
            <br>
            <div>Seit 1996 bin ich als freiberuflicher Ausbilder für Kran- und Staplerführer, Hebebühnenbediener
                sowie als Kransachkundiger
                und Servicepartner der ABUS Kransysteme GmbH im süddeutschen Raum tätig. In dieser Zeit hatte ich
                über
                6000 erfolgreiche Schulungsteilnehmer.</div>
            <br>
            <a class="btn modal-trigger amber darken-3" href="#modalqual">Qualifikationen</a>
        </div>
    </div>
</div>
        </section>
        <style>

        #bio_card{
            padding-left: 2rem;
        }
        #bio_video{
            -webkit-box-shadow: 10px 10px 117px -31px rgba(0,0,0,0.75);
            -moz-box-shadow: 10px 10px 117px -31px rgba(0,0,0,0.75);
            box-shadow: 10px 10px 117px -31px rgba(0,0,0,0.75);
        }
        
        #bio_video::before{
            -webkit-box-shadow: 10px 10px 117px -31px rgba(0,0,0,0.75);
            -moz-box-shadow: 10px 10px 117px -31px rgba(0,0,0,0.75);
            box-shadow: 10px 10px 117px -31px rgba(0,0,0,0.75);
        }
        #shadow{
            position: relative;
            bottom: 11rem;
            left: -3rem;
            width: 100%;
            height: 14rem;
            z-index: -1;
            margin-bottom: -14rem;
        }
        </style>`,
                    attributes: {
                        class: "fa fa-users"
                    }
                });
                blockManager.add('card', {
                    label: 'Card',
                    category: 'Basic',
                    content: '<div class="row">'
                        + '<div class="col s12 m6">'
                        + '<div class="card">'
                        + '<div class="card-image">'
                        + '<img src="http://via.placeholder.com/250x250/BF00FF/ffffff/">'
                        + '<span class="card-title">Card Title</span>'
                        + '</div>'
                        + '<div class="card-content">'
                        + '<p>I am a very simple card. I am good at containing small bits of information.'
                        + 'I am convenient because I require little markup to use effectively.</p>'
                        + '</div>'
                        + '<div class="card-action">'
                        + '<a href="#">This is a link</a>'
                        + '</div>'
                        + '</div>'
                        + '</div>'
                        + '</div>',
                    attributes: {
                        class: 'fa fa-newspaper-o'
                    },
                });
                blockManager.add('footer', {
                    label: 'Footer',
                    category: 'Section',
                    content: '<footer class="page-footer indigo darken-3 gram-footer">' +
                        '<div class="container">' +
                        '<div class="row">' +
                        '<div class="col l6 s12">' +
                        '<h5 class="white-text">Kranservice Schmidt</h5>' +
                        '<p class="white-text text-lighten-4">Wir bieten bei Ihnen vor Ort Unterweisungen für Krane, Gabelstapler und Hebebühnen. Gerne erarbeiten wir auch individuelle Unterweisungslösungen. Neu ist, dass wir Wiederholungsunterweisungen und Unterweisungen als Vorbereitung für die Theoretische Prüfung auch Online anbieten. Wir freuen uns auf Ihre Anfrage.                        </p>' +
                        '</div>' +
                        '<div class="col l3 s12">' +
                        '<h5 class="white-text">Links</h5>' +
                        '<ul class="collection indigo darken-3">' +
                        '<li class="collection-item"><a class="white-text" href="/impressum">Impressum</a></li>' +
                        '<li class="collection-item"><a class="white-text" href="/kontakt">Kontakt</a></li>' +
                        '<li class="collection-item"><a class="white-text" href="/datenschutz">Datenschutz</a></li>' +
                        '</ul>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="footer-copyright">' +
                        '<div class="container">' +
                        'Made by <a class="white-text text-lighten-3" href="http://materializecss.com">Materialize</a>' +
                        '</div>' +
                        '</div>' +
                        '</footer><style>footer.gram-footer ul.collection>li.collection-header,footer.gram-footer ul.collection>li.collection-item{background:0 0;border:0}footer.gram-footer ul.collection{border:0}footer.page-footer{margin:0}#contact input#your-email,#contact textarea#your-message{color:#fff}</style>',
                    attributes: {
                        class: 'fa fa-desktop'
                    }
                });
                blockManager.add('red-youtube', {
                    label: 'Youtube',
                    category: 'Media',
                    content: `
                    <div class="video-container">
                      <iframe width="853" height="480" src="//www.youtube.com/embed/Q8TXgCzxEnw?rel=0" frameborder="0" allowfullscreen></iframe>
                    </div>`,
                    attributes: {
                        class: 'fa fa-youtube'
                    }
                });
                blockManager.add('row', {
                    label: 'Row',
                    category: 'Layout',
                    content: '<div class="row"><p>row</p></div>',
                    attributes: {
                        class: 'fa fa-desktop'
                    }
                });
                blockManager.add('column', {
                    label: 'Column',
                    category: 'Layout',
                    content: '<div class="col s1"><p>column</p></div>',
                    attributes: {
                        class: 'fa fa-desktop'
                    }
                });
                blockManager.add('container', {
                    label: 'Container',
                    category: 'Layout',
                    content: '<div class="container"><p>container</p></div>',
                    attributes: {
                        class: 'fa fa-desktop'
                    }
                });
                blockManager.add('video', {
                    label: 'Video',
                    category: 'Media',
                    attributes: {
                        class: 'fa fa-youtube-play'
                    },
                    content: {
                        type: 'video',
                        src: 'img/video2.webm',
                        style: {
                            height: '350px',
                            width: '615px',
                        }
                    },
                });
                blockManager.add('h1p', {
                    label: 'Text section',
                    category: 'Section',
                    content: '<div>'
                        + '<h3>Insert title here</h3>'
                        + '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua</p>'
                        + '</div>',
                    attributes: {
                        class: 'fa fa-align-center'
                    }
                });
                blockManager.add('quo', {
                    label: 'Quote',
                    category: 'Basic',
                    content: '<blockquote>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore ipsum dolor sit</blockquote>',
                    attributes: {
                        class: 'fa fa-quote-right'
                    }
                });
                blockManager.add('home', {
                    label: 'Home',
                    category: 'Pages',
                    content: `<div class="row white-text" id="all">
                    </br></br></br>
                    <div class="container" style="position: relative;">
                        <div class="">
                            <span class="card-title title" style="font-size: 3em; line-height: 5rem;">Unser Angebot</span> </br>
                            <strong class="title" style="font-size: 1em; line-height: 3rem;">bei Ihnen vor Ort</strong>
                        </div>
                
                        </br>
                    </div>
                    <div class="container">
                        <div class="row">
                            <div class="col m4">
                                <div class="center">
                                    <img src="{% static 'img/Hebebühne_Mockup.png' %}" alt="" class="center responsive-img">
                                    <h5>Hebebühnenschulung</h5>
                                    </br>
                                </div>
                                <ul>
                                    <li>
                                        <div class="valign-wrapper light">
                                            <i class="Small material-icons" style="margin: 0em 1em 0em 0em;">check</i>
                                            Mit unserer Unterweisung erfüllen Sie </br>ArbSchG §12 Abs 1
                                        </div>
                                    </li>
                                    <div style="margin-top: 0.5em;"></div>
                                    <li>
                                        <div class="valign-wrapper light"><i class="Small material-icons"
                                                style="margin: 0em 1em 0em 0em;">check</i>
                                            Zudem erfüllen Sie DGUV Grundsatz 308-008
                                        </div>
                                    </li>
                                    <div style="margin-top: 0.5em;"></div>
                                    <li>
                                        <div class="valign-wrapper light"><i class="Small material-icons"
                                                style="margin: 0em 1em 0em 0em;">check</i>
                                            Der Zeitaufwand für Theorie, Praxis und Prüfungen beträgt 1 Tag
                                        </div>
                                    </li>
                                    <div style="margin-top: 0.5em;"></div>
                                </ul>
                            </div>
                            <div class="col m4">
                                <div class="center">
                                    <img src="{% static 'img/Stapler_Mockup.png' %}" alt="" class="center responsive-img">
                                    <h5>Staplerschulung</h5>
                                    </br>
                                    <p class="light center"></p>
                                </div>
                                <ul>
                                    <li>
                                        <div class="valign-wrapper light">
                                            <i class="Small material-icons" style="margin: 0em 1em 0em 0em;">check</i>
                                            Mit unserer Unterweisung erfüllen Sie </br>DGUV Vorschrift 68
                                        </div>
                                    </li>
                                    <div style="margin-top: 0.5em;"></div>
                                    <li>
                                        <div class="valign-wrapper light"><i class="Small material-icons"
                                                style="margin: 0em 1em 0em 0em;">check</i>
                                            Zudem erfüllen Sie DGUV Grundsatz 308-001
                                        </div>
                                    </li>
                                    <div style="margin-top: 0.5em;"></div>
                                    <li>
                                        <div class="valign-wrapper light"><i class="Small material-icons"
                                                style="margin: 0em 1em 0em 0em;">check</i>
                                            Der Zeitaufwand für Theorie, Praxis und Prüfungen beträgt 1-2 Tag
                                        </div>
                                    </li>
                                    <div style="margin-top: 0.5em;"></div>
                
                                </ul>
                            </div>
                            <div class="col m4">
                                <div class="center">
                
                                    <img src="{% static 'img/Kran_Mockup.png' %}" alt="" class="center responsive-img">
                                    <h5>Kranschulung</h5>
                                    </br>
                                    <p class="light center"></p>
                                </div>
                                <ul>
                                    <li>
                                        <div class="valign-wrapper light">
                                            <i class="Small material-icons" style="margin: 0em 1em 0em 0em;">check</i>
                                            Mit unserer Unterweisung erfüllen Sie DGUV Vorschrift V52 § 29
                                        </div>
                                    </li>
                                    <div style="margin-top: 0.5em;"></div>
                                    <li>
                                        <div class="valign-wrapper light"><i class="Small material-icons"
                                                style="margin: 0em 1em 0em 0em;">check</i>
                                            Zudem erfüllen Sie DGUV Grundsatz 309-003
                                        </div>
                                    </li>
                                    <div style="margin-top: 0.5em;"></div>
                                    <li>
                                        <div class="valign-wrapper light"><i class="Small material-icons"
                                                style="margin: 0em 1em 0em 0em;">check</i>
                                            Der Zeitaufwand für Theorie, Praxis und Prüfungen beträgt 1 Tag
                                        </div>
                                    </li>
                                    <div style="margin-top: 0.5em;"></div>
                                    <li>
                                        <div class="valign-wrapper light"><i class="Small material-icons"
                                                style="margin: 0em 1em 0em 0em;">picture_as_pdf</i>
                                                <a href="https://cdn.unterweisung-on-demand.de/Tagesablauf_Kranführer_01_2020_neu.pdf" target="_blank" class="btn amber darken-2 white-text">Tagesablauf</a>
                                        </div>
                                    </li>
                                </ul>
                               
                            </div>
                        </div>
                    </div>
                    <div class="container hide-on-small-only">
                        </br>
                        </br>
                    </div>
                
                
                </div>
                
                
                
                </br>
                
                <div class="section no-pad-bot" id="index-banner">
                    <div class="container">
                        <div class="hide-on-small-only">
                        </div>
                
                        <div class="row">
                            <div class="col s12 m6">
                                <div class="row hide-on-small-only">
                                    <div class="col s12  card" id="phone_card">
                                        <div class="card-content white-text valign-wrapper">
                                            <i class="medium material-icons " style="margin-right: 2rem;">local_phone</i>
                                            <div>
                                                <h5 style="margin-top: 0rem;">Telefonberatung</h5>
                                                <p>unter Tel.: 08333 95304</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <h4>Warum Kranservice Schmidt</h4>
                                <div class="divider"></div>
                                <br>
                                <ul>
                                    <li>
                                        <div class="valign-wrapper" style="font-size: 1.3em;"><i class="Small material-icons"
                                                style="margin: 1em;">check</i>Mit uns haben Sie Rechtsicherheit. Unsere Unterweisungen
                                            genügen der DGUV
                                            Vorschrift 52 und DGUV Grundsatz 309-003</div>
                                    </li>
                                    <div style="margin-top: 0.5em;"></div>
                                    <li>
                                        <div class="valign-wrapper" style="font-size: 1.3em;"><i class="Small material-icons"
                                                style="margin: 1em;">check</i>Bereits 6000 erfolgreiche Teilnehmer. Mehr als 120 Firmen
                                            vertrauen uns bereits Ihre Kranschulung an</div>
                                    </li>
                                    <div style="margin-top: 0.5em;"></div>
                                    <li>
                                        <div class="valign-wrapper" style="font-size: 1.3em;"><i class="Small material-icons"
                                                style="margin: 1em;">check</i>Die Präsentation ist modern und anschaulich. Ihre Inhalte
                                            bewährt</div>
                                    </li>
                                    <div style="margin-top: 0.5em;"></div>
                                    <li>
                                        <div class="valign-wrapper" style="font-size: 1.3em;"><i class="Small material-icons"
                                                style="margin: 1em;">check</i>Als ABUS Service Partner garantieren wir Ihnen höchste
                                            Qualität und
                                            Kompetenz in Sachen Kran. 24 Jahre Erfahrung sprechen für sich</div>
                                    </li>
                                    <div style="margin-top: 0.5em;"></div>
                                </ul>
                                <br>
                                <br>
                            </div>
                
                            <div class="col s12 m5 offset-m1">
                                <div class="row">
                                    <div class="card col s12" id="request_card">
                                        <div class="card-content white-text">
                                            <span class="card-title" style="font-size: 2em;">Angebot Anfordern</span>
                                            <strong>in 1-2 Werktagen</strong>
                                            <br>
                                            <br>
                                            <div class="row" style="margin-bottom: 0;">
                                                <form class="col s12">
                                                    <div class="row" style="margin-bottom: 0;">
                                                        <div class="input-field col s6">
                                                            <input id="name" type="text" class="validate">
                                                            <label for="name">Name</label>
                                                        </div>
                                                        <div class="input-field col s6">
                                                            <input id="phone" type="number" class="validate">
                                                            <label for="phone">Telefon</label>
                                                        </div>
                                                    </div>
                                                    <div class="row" style="margin-bottom: 0;">
                                                        <div class="input-field col s12">
                                                            <input id="email" type="email" class="validate">
                                                            <label for="email">Email</label>
                                                        </div>
                                                    </div>
                                                    <div class="row" style="margin-bottom: 0;">
                                                        <div class="input-field col s8">
                                                            <input id="firma" type="text" class="validate">
                                                            <label for="firma">Firma</label>
                                                        </div>
                                                        <div class="input-field col s4">
                                                            <input id="postleitzahl" type="number" class="validate">
                                                            <label for="postleitzahl">Postleitzahl</label>
                                                        </div>
                                                    </div>
                                                    <div class="row" style="margin-bottom: 0;">
                                                        <div class="input-field col s8">
                                                            <select id="schulungen" multiple required="required">
                                                                <option value="" disabled selected>Schulungen wählen</option>
                                                                <option value="1">Hallenkran</option>
                                                                <option value="2">Hebebühne</option>
                                                                <option value="3">Stapler</option>
                                                            </select>
                                                            <label>Schulungen</label>
                                                        </div>
                                                        <div class="input-field col s4">
                                                            <input id="teilnehmer" type="number" class="validate">
                                                            <label for="teilnehmer">Teilnehmer</label>
                                                        </div>
                                                    </div>
                                                    <div class="row" style="margin-bottom: 0;">
                                                        <div class="input-field col s12">
                                                            <textarea id="komentar" class="materialize-textarea validate"></textarea>
                                                            <label for="komentar">Komentar (optional)</label>
                                                        </div>
                                                    </div>
                                                    <div class="row" style="margin-bottom: 0;">
                                                        <div class="col s12" style="margin-bottom: 0;">
                                                            <div id="request"
                                                                class="btn waves-effect waves-light white indigo-text text-darken-3">
                                                                Absenden
                                                                <i class="material-icons right">send</i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                
                                    <div class="col s12" style="padding: 0rem 0rem 0rem 0rem;">
                                        <ul class="collapsible">
                                            <li>
                                                <div class="collapsible-header"><i class="material-icons">info</i>Für welche Krane gilt
                                                    die Kranschulung?</div>
                                                <div class="collapsible-body"><span>Die Kranschulung gilt für Hallenkrane und
                                                        Brückenkrane und <b>nicht für Baukrane</b>. An einer Unterweisung für
                                                        LKW-Laderkrane wird gearbeitet</span></div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="col s12">
                                <div class="row">
                                    <h4>Der Referent</h4>
                                    <div class="divider"></div>
                                    <br>
                                    <div class="col s12 m5 l4">
                                        <div class="video-container">
                                            <iframe src="https://www.youtube.com/embed/zim6UfnE2zU" frameborder="0"
                                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                                allowfullscreen></iframe>
                                        </div>
                                        <br>
                                        <br>
                                    </div>
                
                                    <div class="col s12 m7 l8" style="font-size: 1.3em;">
                                        <div><strong>Michael Schmidt</strong></div>
                                        <br>
                                        <div>Seit 1996 bin ich als freiberuflicher Ausbilder für Kran- und Staplerführer, als
                                            Kransachkundiger
                                            und Servicepartner der ABUS Kransysteme GmbH im süddeutschen Raum tätig. In dieser Zeit
                                            hatte ich über
                                            6000 erfolgreiche Schulungsteilnehmer.</div>
                                        <br>
                                        <a class="btn modal-trigger green" href="#modal1">Qualifikationen</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                
                <div class="container">
                    <div class="section">
                        <div class="row">
                            <h4>Was sagen unsere Kunden?</h4>
                        </div>
                        <div class="divider"></div>
                        <br>
                
                        <!--   Icon Section   -->
                        <div class="row">
                            <div class="col s12 m4">
                                <div class="icon-block center">
                                    <img src="{% static 'img/Fischer-Edelstahlrohre1-min.jpg' %}" alt="" class="center responsive-img">
                                    <h5 class="center">Thomas Gaiser <br> <span class="grey-text" style="font-size: 0.5em;">Fischer
                                            Edelstahlrohre GmbH</span> </h5>
                                    <p class="light">
                                        Wir arbeiten seit Jahren mit der Fa. Kranservice Schmidt. Die Schulungen sind
                                        effizient, das Sicherheitsbewusstsein unserer Mitarbeiter wird positiv verändert.</p>
                                </div>
                            </div>
                
                            <div class="col s12 m4">
                                <div class="icon-block center">
                                    <img src="{% static 'img/kunde_muehlb1-min.jpg' %}" alt="" class="center responsive-img"></h2>
                                    <h5 class="center">Thomas Mühlbauer <br> <span class="grey-text" style="font-size: 0.5em;">Rampp
                                            Maschinenbau GmbH Co. KG</span></h5>
                
                                    <p class="light">
                                        Über viele Jahre ist die Fa. Kranservice Michael Schmidt ein verlässlicher
                                        Partner
                                        an unserer Seite. Sie ist unser Ansprechpartner Nr.1 in allen Belangen rund um Service und
                                        Schulungen. Der kompetente und unkomplizierte Umgang ist besonders hervorzuheben.</p>
                                </div>
                            </div>
                
                            <div id="modal1" class="modal">
                                <div class="modal-content">
                                    <h3>Qualifikationen</h3>
                                    </br>
                
                                    <div class="collection">
                                        <a href="https://cdn.unterweisung-on-demand.de/Meisterbrief_Michael_Schmidt.pdf" target="_blank" class="collection-item">Meisterbrief (PDF)</a>
                                        <a href="https://cdn.unterweisung-on-demand.de/Sachverständigenausbildung_Michael_Schmidt.pdf" target="_blank" class="collection-item">Sachverständigenausbildung (PDF)</a>
                                        <a href="https://cdn.unterweisung-on-demand.de/Zertifikat_Ausbilder_für_Kranführer.pdf" target="_blank" class="collection-item">Kranführer Ausbilder Zertifikat (PDF)</a>
                                      </div>
                
                                </div>
                
                                <div class="modal-footer">
                                    <a href="#!" class="modal-close waves-effect waves-green btn-flat">schließen</a>
                                </div>
                            </div>
                
                            <div class="col s12 m4">
                                <div class="icon-block">
                                    <h5 class="center"><a
                                            href="https://www.google.com/search?source=hp&ei=D7enXLnyH--FmwWMnLHwBQ&q=kranservice+schmidt&btnK=Google-Suche&oq=kranservice+schmidt&gs_l=psy-ab.3..0i22i30l2.1149.3847..3980...0.0..0.101.1373.17j2....2..0....1..gws-wiz.....0..0j0i131j0i10j0i22i10i30.5uRe7kqHO3c#btnK=Google-Suche&lrd=0x479bf9635e34608f:0x74918f5c9d898a86,1,,,">Google
                                            Bewertungen</a></h5>
                                    <div id="google-reviews"><br>
                                        <div class="review-item">
                                            <div class="review-meta"><span class="review-author">Ma K.</span><span
                                                    class="review-sep"></span></div>
                                            <div class="review-stars">
                                                <ul>
                                                    <li><i class="star"></i></li>
                                                    <li><i class="star"></i></li>
                                                    <li><i class="star"></i></li>
                                                    <li><i class="star"></i></li>
                                                    <li><i class="star"></i></li>
                                                </ul>
                                            </div>
                                            <p class="review-text">Guter Kurs - zum weiterempfehlen nur .. sehr informativ reich</p>
                                        </div>
                                        <div class="review-item">
                                            <div class="review-meta"><span class="review-author">Alfred J.</span><span
                                                    class="review-sep"></span>
                                            </div>
                                            <div class="review-stars">
                                                <ul>
                                                    <li><i class="star"></i></li>
                                                    <li><i class="star"></i></li>
                                                    <li><i class="star"></i></li>
                                                    <li><i class="star"></i></li>
                                                    <li><i class="star"></i></li>
                                                </ul>
                                            </div>
                                            <p class="review-text">Die Schulung war sehr interessant und informativ</p>
                                        </div>
                                        <div class="review-item">
                                            <div class="review-meta"><span class="review-author">Reiner H.</span><span
                                                    class="review-sep"></span>
                                            </div>
                                            <div class="review-stars">
                                                <ul>
                                                    <li><i class="star"></i></li>
                                                    <li><i class="star"></i></li>
                                                    <li><i class="star"></i></li>
                                                    <li><i class="star"></i></li>
                                                    <li><i class="star"></i></li>
                                                </ul>
                                            </div>
                                            <p class="review-text">Top Kranschulung viel neues erfahren!</p>
                                        </div>
                                        <div class="review-item">
                                            <div class="review-meta"><span class="review-author">Alexander W.</span><span
                                                    class="review-sep"></span>
                                            </div>
                                            <div class="review-stars">
                                                <ul>
                                                    <li><i class="star"></i></li>
                                                    <li><i class="star"></i></li>
                                                    <li><i class="star"></i></li>
                                                    <li><i class="star"></i></li>
                                                    <li><i class="star"></i></li>
                                                </ul>
                                            </div>
                                            <p class="review-text"></p>
                                        </div>
                                    </div><br><br>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br><br>
                
                    <h4>Wer sind unsere Kunden?</h4>
                    <div class="divider"></div>
                    <br>
                    <div class="row">
                        <img class="col m2 s4 responsive-img" src="{% static 'img/ABUS_Logo-min.jpg' %}"></a>
                        <img class="col m2 s4 responsive-img" src="{% static 'img/AMG_Logo-min.jpg' %}"></a>
                        <img class="col m2 s4 responsive-img" src="{% static 'img/BMW_Logo-min.jpg' %}"></a>
                        <img class="col m2 s4 responsive-img" src="{% static 'img/Porsche_Logo-min.jpg' %}"></a>
                        <img class="col m2 s4 responsive-img" src="{% static 'img/Siemens_Logo-min.jpg' %}"></a>
                        <img class="col m2 s4 responsive-img" src="{% static 'img/wuerth_logo-min.jpg' %}"></a>
                    </div>
                    <a style="font-size: 1.5rem;" href="{% url 'referenzen' %}">Referenzliste</a>
                    <br>
                    <br>
                    <br>
                </div>`,
                    attributes: {
                        class: 'fa fa-columns'
                    }
                });
                blockManager.add('danke', {
                    label: 'Danke',
                    category: 'Pages',
                    content: `<div class="container">
                    <br>
                    <div class="card amber darken-3">
                            <div class="card-content white-text">
                                    <h3>Vielen Dank für Ihre Anfrage</h3>
                                    <p class="flow-text">Wir senden Ihnen Ihr Angebot binnen 1. Werktag</p>
                                    <br>
                            </div>
                            
                    </div>
                    <br>
                    <h3 class="flow-text">Wusten Sie, das jährliche Wiederholungsunterweisungen Pflicht sind?</h3>
                    <div class="divider"></div>
                    <br>
                    <div class="row">
                        <div class="col s12 m6">
                            <div class="icon-block">
                                <h5 class="center">Vorort wdh. Unterweisung</h5>
                                <ul>
                                    <li>
                                      <div class="valign-wrapper light" style="font-size: 1.3em;">
                                        <i class="Small material-icons"style="margin: 1em;">check</i>
                                        Mit unserer jährlichen wdh.-Unterweisung erfüllen Sie ArbSchG §12 Abs. 1 und DGUV V1 §4. 
                                        </div>
                                    </li>
                                    <div style="margin-top: 0.5em;"></div>
                                    <li>
                                      <div class="valign-wrapper light" style="font-size: 1.3em;"><i class="Small material-icons"
                                          style="margin: 1em;">check</i>Der Zeitaufwand beträgt vor Ort ca. 3,5h.</div>
                                    </li>
                                    <div style="margin-top: 0.5em;"></div>
                                  </ul>
                                  <div class="center"><a class="center btn amber darken-3" href="{% url 'kontakt' %}">Anfragen</a></div>
                            </div>
                        </div>
                    
                        <div class="col s12 m6">
                            <div class="icon-block">
                                    <div class="video-container">
                                        <iframe width="640" height="360" src="https://www.youtube.com/embed/06CKZ6TT9Kw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                    </div>
                
                                          
                                    <h5 class="center">Online wdh. Unterweisung</h5>
                                    <ul>
                                        <li>
                                          <div class="valign-wrapper light">
                                            <i class="Small material-icons"style="margin: 1em;">check</i>
                                            Mit unserer online wdh.-Unterweisung erfüllen Sie ArbSchG §12 Abs. 1 und DGUV V1 §4. 
                                            </div>
                                        </li>
                                        <div style="margin-top: 0.5em;"></div>
                                        <li>
                                          <div class="valign-wrapper light"><i class="Small material-icons"
                                              style="margin: 1em;">check</i>Der Zeitaufwand beträgt für Sie ca. 126 min</div>
                                        </li>
                                        <div style="margin-top: 0.5em;"></div>
                                      </ul>
                                      <div class="center"><a class="center btn indigo darken-3" href="https://www.unterweisung-on-demand.de/login/">Preise</a></div>
                            </div>
                        </div>
                    </div>
                    
                    <br>
                    <h3>Weitere Unterweisungen</h3>
                    <div class="divider"></div>
                    <div class="row">
                        <div class="col s12 m4">
                            <div class="icon-block">
                                    <img class="center responsive-img" src="{% static 'img/hebebühne-min.jpg' %}"></a>
                                    <h5 class="center">Hebebühnen Unterweisung</h5>
                                    <ul>
                                        <li>
                                            <div class="valign-wrapper light" >
                                              <i class="Small material-icons"style="margin: 1em;">check</i>
                                              Mit unserer Hebebühnenunterweisung erfüllen sie ArbSchG §12 Abs 1
                                              </div>
                                          </li>
                                          <div style="margin-top: 0.5em;"></div>
                                          <li>
                                            <div class="valign-wrapper light" ><i class="Small material-icons"
                                                style="margin: 1em;">check</i>
                                                Zudem erfüllen sie DGUV Grundsatz 308-008 
                                              </div>
                                          </li>
                                          <div style="margin-top: 0.5em;"></div>
                                          <li>
                                            <div class="valign-wrapper light" ><i class="Small material-icons"
                                                style="margin: 1em;">check</i>
                                                Der Zeitaufwand für Theorie, Praxis und Prüfungen beträgt 1 Tag
                                              </div>
                                          </li>
                                          <div style="margin-top: 0.5em;"></div>
                                  
                                      </ul>
                                    <div class="center"><a class="center btn amber darken-3" href="{% url 'kontakt' %}">Anfragen</a></div>
                            </div>
                        </div>
                    
                        <div class="col s12 m4">
                            <div class="icon-block">
                                <img class="center responsive-img" src="{% static 'img/stapler-min.jpg' %}"></a>
                                <h5 class="center">Stapler Unterweisung</h5>
                                <ul>
                                    <li>
                                        <div class="valign-wrapper light" >
                                          <i class="Small material-icons"style="margin: 1em;">check</i>
                                          Mit unserer Staplerunterweisung erfüllen sie DGUV Vorschrift 68
                                          </div>
                                      </li>
                                      <div style="margin-top: 0.5em;"></div>
                                      <li>
                                        <div class="valign-wrapper light" ><i class="Small material-icons"
                                            style="margin: 1em;">check</i>
                                            Zudem erfüllen sie DGUV Grundsatz 308-001
                                          </div>
                                      </li>
                                      <div style="margin-top: 0.5em;"></div>
                                      <li>
                                        <div class="valign-wrapper light" ><i class="Small material-icons"
                                            style="margin: 1em;">check</i>
                                            Der Zeitaufwand für Theorie, Praxis und Prüfungen beträgt 1 Tag
                                          </div>
                                      </li>
                                      <div style="margin-top: 0.5em;"></div>
                              
                                  </ul>
                                <div class="center"><a class="center btn amber darken-3" href="{% url 'kontakt' %}">Anfragen</a></div>
                            </div>
                        </div>
                
                        <div class="col s12 m4">
                            <div class="icon-block">
                                <img class="center responsive-img" src="{% static 'img/kran-min.jpg' %}"></a>
                                <h5 class="center">Kran Unterweisung</h5>
                                <ul>
                                    <li>
                                        <div class="valign-wrapper light" >
                                          <i class="Small material-icons"style="margin: 1em;">check</i>
                                          Mit unserer Kranführerunterweisung erfüllen sie DGUV Vorschrift V52 § 29 
                                          </div>
                                      </li>
                                      <div style="margin-top: 0.5em;"></div>
                                      <li>
                                        <div class="valign-wrapper light" ><i class="Small material-icons"
                                            style="margin: 1em;">check</i>
                                            Zudem erfüllen sie DGUV Grundsatz 309-004
                                          </div>
                                      </li>
                                      <div style="margin-top: 0.5em;"></div>
                                      <li>
                                        <div class="valign-wrapper light" ><i class="Small material-icons"
                                            style="margin: 1em;">check</i>
                                            Der Zeitaufwand für Theorie, Praxis und Prüfungen beträgt 1 Tag
                                          </div>
                                      </li>
                                      <div style="margin-top: 0.5em;"></div>
                         
                                  </ul>
                                <div class="center"><a class="center btn amber darken-3" href="{% url 'kontakt' %}">Anfragen</a></div>
                            </div>
                        </div>
                    </div>
                </div>`,
                    attributes: {
                        class: 'fa fa-columns'
                    }
                });
                blockManager.add('split', {
                    label: 'Split',
                    category: 'Pages',
                    content: `<div class="indigo darken-3">
                    <div class="container">
                            <div class="row white-text box valign-wrapper hide-on-small-only" style="height: 90vh;">
                                <div class="col s12 m6 center">
                                        <i class="large material-icons">person</i>
                                    <h2>Angebot für Einzelperson<br></h2>
                                    <a class="waves-effect waves-light btn modal-trigger amber darken-3" href="#">Fortfahren</a>
                                </div>
                                <div class="col s12 m6 center" style="border-left: thin solid #eeeeee;">
                                    <i class="large material-icons">group</i>
                                    <h2>Angebot für Gruppen</h2>
                                    <a class="waves-effect waves-light btn modal-trigger amber darken-3" href="#">Fortfahren</a>
                                </div>
                            </div>
            
                            <div class="white-text hide-on-med-and-up">
                                <div class="col s12 m6 center" style="margin-top: 5vh;">
                                        <i class="large material-icons">person</i>
                                        <h2>Angebot für Einzelperson<br></h2>
                                    <a class="waves-effect waves-light btn modal-trigger amber darken-3" href="#">Fortfahren</a>
                                </div>
                                <div class="divider" style="margin-top: 5vh;"></div>
                                <div class="col s12 m6 center" style="margin-top: 5vh;">
                                    <i class="large material-icons">group</i>
                                    <h3>Angebot für Gruppen</h3>
                                    <a class="waves-effect waves-light btn modal-trigger amber darken-3" href="#">Fortfahren</a>
                                </div>
                            </div>
                        </div>
            
                      </div>`,
                    attributes: {
                        class: 'fa fa-columns'
                    }
                });
                blockManager.add('std', {
                    label: 'Starter',
                    category: 'Section',
                    content: '<header class="section no-pad-bot" id="banner-gradient">' +
                        '<nav class="bg-none" role="navigation">' +
                        '<div class="nav-wrapper container"><a id="logo-container" href="#" class="brand-logo white-text">Logo</a>' +
                        '<ul class="right hide-on-med-and-down">' +
                        '<li><a class="white-text" href="#">Navbar Link</a></li>' +
                        '<li><a class="white-text" href="#">Navbar Link 2</a></li>' +
                        '</ul>' +
                        '<ul id="nav-mobile" class="side-nav">' +
                        '<li><a href="#">Navbar Link</a></li>' +
                        '<li><a href="#">Navbar Link 2</a></li>' +
                        '</ul>' +
                        '<a href="#" data-activates="nav-mobile" class="button-collapse white-text"><i class="material-icons">menu</i></a>' +
                        '</div>' +
                        '</nav>' +
                        '<div class="container">' +
                        '<br><br>' +
                        '<h1 class="header center white-text">Starter Template</h1>' +
                        '<div class="row center">' +
                        '<h5 class="header col s12 light white-text">A modern responsive front-end framework based on Material Design</h5>' +
                        '</div>' +
                        '<div class="row center">' +
                        '<a href="#" id="download-button" class="btn-large waves-effect waves-light light-blue">Get Started</a>' +
                        '</div>' +
                        '<br><br>' +
                        '</div>' +
                        '</header>' +
                        `<style>#banner-gradient{background:#7abcff;background:-moz-linear-gradient(45deg,#7abcff 0,#60abf8 44%,#4096ee 100%);background:-webkit-linear-gradient(45deg,#7abcff 0,#60abf8 44%,#4096ee 100%);background:linear-gradient(45deg,#7abcff 0,#60abf8 44%,#4096ee 100%);filter:progid:DXImageTransform.Microsoft.gradient( startColorstr='#7abcff', endColorstr='#4096ee', GradientType=1)}.bg-none{background:none;}nav .brand-logo,nav ul a{color:#444}</style>
                    <script type="text/javascript">
                        $(document).ready(function(){
                            $('.button-collapse').sideNav();
                        });
                    </script>`,
                    attributes: {
                        class: 'fa fa-wpforms'
                    }
                });
                blockManager.add('nav4', {
                    label: 'Navbar Fixed',
                    category: 'Section',
                    content:
                        `<header>
        
                    <div class="navbar-fixed">
                      <nav class="navbar-fixed-top no-shadows blue">
                        <div class="nav-wrapper container">
                          <a href="#!" class="brand-logo black-text">Logo</a>
                          <a href="#" data-target="mobile-demo" class="sidenav-trigger black-text">
                          <i class="material-icons">menu</i></a>
                          <ul class="right hide-on-med-and-down">
                            <li><a href="sass.html">Sass</a></li>
                            <li><a href="badges.html">Components</a></li>
                            <li><a href="collapsible.html">Javascript</a></li>
                            <li><a href="mobile.html">Mobile</a></li>
                          </ul>
                        </div>
                      </nav>
                    </div>
                  
                    <ul class="sidenav" id="mobile-demo">
                      <li><a href="sass.html">Sass</a></li>
                      <li><a href="badges.html">Components</a></li>
                      <li><a href="collapsible.html">Javascript</a></li>
                      <li><a href="mobile.html">Mobile</a></li>
                    </ul>
                    
                    <script>
                     $(document).ready(function(){
                    
                     var $nav = $(".navbar-fixed-top");
                        $nav.toggleClass('transparent', $(this).scrollTop() < $nav.height());
                      $('.sidenav').sidenav();
                    });
                    
                    $('body').scroll(function () {
                        var $nav = $(".navbar-fixed-top");
                        $nav.toggleClass('transparent', $(this).scrollTop() < $nav.height());
                      });
                      $(document).scroll(function () {
                        var $nav = $(".navbar-fixed-top");
                        $nav.toggleClass('transparent', $(this).scrollTop() < $nav.height());
                      });
                    </script>
                    <style>
                    
                  .navbar-fixed-top.scrolled {
                    background-color: #eee !important;
                    transition: background-color 200ms linear;
                  }
                  
                  .navbar-fixed-top.scrolled .nav-link {
                    color:#555;
                  }
                  
                  .no-shadows {
                      box-shadow: none!important;
                  }
                  </style>
                  </header>`,
                    attributes: {
                        class: 'fa fa-window-maximize'
                    }
                });
                blockManager.add('request_person', {
                    label: 'Person Form',
                    category: 'Forms',
                    content:
                        ` <div id="banner-message" style="background: #fff;
                    border-radius: 4px;
                    padding: 20px;
                    font-size: 25px;
                    text-align: center;
                    transition: all 0.2s;
                    margin: 0 auto;">
                     <p>Heute Anfragen</p>
                     <div class="row">
                       <form class="col s12">
                         <div class="row">
                           <div class="input-field col s6">
                             <input placeholder="Max Mustermann" id="first_name" type="text" class="validate">
                             <label for="first_name">Name</label>
                           </div>
                           <div class="input-field col s6">
                             <input placeholder="33" id="last_name" type="number" class="validate">
                             <label for="last_name">Alter</label>
                           </div>
                         </div>
                         <div id="send_request" class="btn blue darken-3 white-text">
                           Senden
                         </div>
                       </form>
                     </div>
                     <script>
                       // find elements
                       var banner = $("#banner-message")
                       var button = $("#send_request")
                  
                       // handle click and add class
                       button.on("click", function() {
                         var d = {};
                         d.name = $("#first_name").val();
                         d.age = $("#last_name").val();
        
                         console.log(d);
                  
        
                        $.ajax({method:'POST', url:'/api/person/',data:d,beforeSend: function (xhr, settings) {
                            xhr.setRequestHeader("X-CSRFToken", token );
                        }, succes: function(data){console.log(data); M.toast({html: 'Anfrage Gesendet'})}});
                  
                       })
                  
                     </script>
                   </div>`,
                    attributes: {
                        class: 'fa fa-window-maximize'
                    }
                });
                blockManager.add('request_persons', {
                    label: 'Person Data',
                    category: 'Forms',
                    content:
                        ` <div id="banner-message" style="background: #fff;
                    border-radius: 4px;
                    padding: 20px;
                    font-size: 25px;
                    text-align: center;
                    transition: all 0.2s;
                    margin: 0 auto;
                    width: auto;">
                     <p>Anfragen</p>
                     <div class="row">
                       <table id="table">
                         <thead>
                           <tr>
                             <th>Name</th>
                             <th>Alter</th>
                           </tr>
                         </thead>
                  
                         <tbody>
                         </tbody>
                       </table>
                       <div id="send_request1" class="btn blue darken-3 white-text">
                         Aktualisieren
                       </div>
                     </div>
                     <script>
                       var button = $("#send_request1")
                    
                        function update1(){
                            $.ajax({
                                method: 'GET',
                                url: '/api/person/',
                                success: function(data) {
                                 M.toast({html: 'Daten Aktualisiert'})
                                  $('#table tbody').empty();
                                  jQuery.each(data, function() {
                                    $('#table > tbody:last-child').append('<tr><td>' + this.name + '</td><td>' + this.age + '</td></tr>');
                                  });
                                  console.log(data);
                                }
                              });
                        }
        
                        update1();
        
                       button.on("click", function() {
                         update1();
                       });
                  
                     </script>
                   </div>`,
                    attributes: {
                        class: 'fa fa-window-maximize'
                    }
                });
                blockManager.add('request_pages', {
                    label: 'Pages List',
                    category: 'Forms',
                    content:
                        `<div id="banner-message" style="background: #fff;
                    border-radius: 4px;
                    padding: 20px;
                    font-size: 25px;
                    text-align: center;
                    transition: all 0.2s;
                    margin: 0 auto;
                    width: auto;">
        <p>Pages</p>
        <div class="row">
        <table id="table1">
          <thead>
            <tr>
              <th>Name</th>
              <th>Link</th>
            </tr>
          </thead>
        
          <tbody>
          </tbody>
        </table>
        <div id="send_request2" class="btn blue darken-3 white-text">
          Aktualisieren
        </div>
        </div>
        <script>
        var button = $("#send_request2")
        
        function update(){
            $.ajax({
                method: 'GET',
                url: '/pages/',
                success: function(data) {
                  M.toast({
                    html: 'Daten Aktualisiert'
                  })
                  $('#table1 tbody').empty();
                  jQuery.each(data, function() {
                    $('#table1 > tbody:last-child').append('<tr><td>' + this.name + '</td><td><a href="/pages/'+this.slug+'">' + this.slug + '</td></tr>');
                  });
                  console.log(data);
                }
              });
        }
        
        update();
        
        button.on("click", function() {
            update();
        });
        
        </script>
        </div>`,
                    attributes: {
                        class: 'fa fa-window-maximize'
                    }
                });
                blockManager.add('simple_card', {
                    label: 'Card Panel',
                    category: 'Basic',
                    content:
                        `<div class="col s12 m5">
                        <div class="card-panel teal">
                        <div class="row">
                        <span class="white-text">I am a very simple card. I am good at containing small bits of information.
                          I am convenient because I require little markup to use effectively. I am similar to what is called a panel in other frameworks.
                          </span>
                        </div>
                        </div>
                      </div>`,
                    attributes: {
                        class: 'fa fa-window-maximize'
                    }
                });
                blockManager.add('option_drop_down', {
                    label: 'Options Dropdown',
                    category: 'Forms',
                    content:
                        `
                        <div>
                        <div id="select_from_options" class="input-field col s8">
                        </div>
                        <script>
                            $(document).ready(function(){
                                $( "#select_from_options" ).html(\`<select tabindex="-1">
                                    <option value="1">Kranschulung</option>
                                    <option value="2">Staplerschulung</option>
                                    <option value="3">Hebebühnenschulung</option>
                                </select>
                                <label class="white-text">Schulung</label>\` );
                                
                              $('select').formSelect();
                            });
                        </script>
                    </div>  `,
                    attributes: {
                        class: 'fa fa-window-maximize'
                    }
                });
                blockManager.add('form_checkbox', {
                    label: 'Checkbox',
                    category: 'Forms',
                    content:
                        `<p>
                        <label>
                          <input type="checkbox" />
                          <span>Checkbox</span>
                        </label>
                        </p>`,
                    attributes: {
                        class: 'fa fa-check-square'
                    }
                });
                blockManager.add('form_text_input', {
                    label: 'Text Input',
                    category: 'Forms',
                    content:
                        `<div class="input-field col s6">
                            <input placeholder="Placeholder" id="first_name" type="text" class="validate">
                            <label for="first_name">First Name</label>
                      </div>`,
                    attributes: {
                        class: 'fa fa-wpforms'
                    }
                });
                blockManager.add('icon_list_item', {
                    label: 'Icon List Item',
                    category: 'Forms',
                    content:
                        ` <div class="col s12 m6 big-list-item" style="display:table;">
                        <div style="display:table-cell;vertical-align:top; padding-right: 1rem; padding-top: 0.5rem;">
                            <i class="material-icons" style="">info</i>
                        </div>
                        <div style="display:table-cell;">
                            <div id="ikxegg"><span id="iamqjh"><b id="i96ps5">Brave Ads do not collect<br>information about you</b></span></div>
                            <div><span id="iijxck">The business of digital advertising currently relies on companies collecting as much information about you as possible. With Brave Rewards, ad matching happens directly on your device and removes the neeed to leak personal data to provide relevant advertising</span></div>
                        </div>
                </div>`,
                    attributes: {
                        class: 'fa fa-wpforms'
                    }
                });
                blockManager.add('stepper', {
                    label: 'Stepper',
                    category: 'Stepper',
                    content:
                        ` <script>
                        var stepper = document.querySelector('.stepper');
                        var stepperInstace = new MStepper(stepper, {
                           // options
                           firstActive: 0 // this is the default
                        })
                    </script><ul class="stepper">
                        <li class="step active">
          <div class="step-title waves-effect">E-mail</div>
          <div class="step-content">
             <!-- Your step content goes here (like inputs or so) -->
             <div class="step-actions">
                <!-- Here goes your actions buttons -->
                <button class="waves-effect waves-dark btn next-step">CONTINUE</button>
             </div>
          </div>
        </li></ul>`,
                    attributes: {
                        class: 'fa fa-wpforms'
                    }
                });
                blockManager.add('stepper_item', {
                    label: 'Stepper Item',
                    category: 'Stepper',
                    content:
                        `<li class="step active">
                        <div class="step-title waves-effect">E-mail</div>
                        <div class="step-content">
                           <!-- Your step content goes here (like inputs or so) -->
                           <div class="step-actions">
                              <!-- Here goes your actions buttons -->
                              <button class="waves-effect waves-dark btn next-step">CONTINUE</button>
                           </div>
                        </div>
                     </li>`,
                    attributes: {
                        class: 'fa fa-wpforms'
                    }
                });
                blockManager.add('css_stepper_containerr', {
                    label: 'CSS Stepper Container',
                    category: 'Stepper',
                    content:
                        `<div class="row">
                        <style>
                        *,
        *:before,
        *:after {
        box-sizing: border-box;
        }
        .step { 
        position: relative; 
        min-height: 64px 
        /* circle-size */ ; }
        .step > div:first-child { position: static; height: 0; }
        .step > div:last-child { margin-left: 64px ; padding-left: 16px; }
        .circle { background: #4285f4; width: 64px; height: 64px; line-height: 64px; border-radius: 32px; position: relative; color: white; text-align: center; font-size:40px}
        .line { position: absolute; border: 4px solid gainsboro; left: 30px; bottom: 10px; top: 72px; }
        .step:last-child .line { display: none; }
        .title { line-height: 32px; font-weight: bold; }
                        </style>
                        Step Here</div>`,
                    attributes: {
                        class: 'fa fa-wpforms'
                    }
                });
                blockManager.add('css_stepper_item', {
                    label: 'CSS Stepper Item',
                    category: 'Stepper',
                    content:
                        `
                        <div class="step">
                            <div>
                                <div class="circle">1</div>
                                <div class="line"></div>
                            </div>
                            <div>
                                <div class="title">Title</div>
                                <div class="body">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<br/><br/><br/><br/></div>
                            </div>
                            
                        </div>`,
                    attributes: {
                        class: 'fa fa-wpforms'
                    }
                });
                blockManager.add('request_offer_form', {
                    label: 'Angebot Form',
                    category: 'Forms',
                    content:
                        `<div class="col s12 m5 offset-m1">
                        <div class="row">
                            <div class="card col s12" id="request_card">
                                <div class="card-content">
                                    <span class="card-title" style="font-size: 2em;">Angebot Anfordern</span>
                                    <strong>in 1-2 Werktagen</strong>
                                    <br>
                                    <br>
                                    <div class="row" style="margin-bottom: 0;">
                                        <form class="col s12">
                                            <div class="row" style="margin-bottom: 0;">
                                                <div class="input-field col s6">
                                                    <input id="name" type="text" class="validate">
                                                    <label for="name">Name</label>
                                                </div>
                                                <div class="input-field col s6">
                                                    <input id="phone" type="number" class="validate">
                                                    <label for="phone">Telefon</label>
                                                </div>
                                            </div>
                                            <div class="row" style="margin-bottom: 0;">
                                                <div class="input-field col s12">
                                                    <input id="email" type="email" class="validate">
                                                    <label for="email">Email</label>
                                                </div>
                                            </div>
                                            <div class="row" style="margin-bottom: 0;">
                                                <div class="input-field col s8">
                                                    <input id="firma" type="text" class="validate">
                                                    <label for="firma">Firma</label>
                                                </div>
                                                <div class="input-field col s4">
                                                    <input id="postleitzahl" type="number" class="validate">
                                                    <label for="postleitzahl">Postleitzahl</label>
                                                </div>
                                            </div>
                                            <div class="row" style="margin-bottom: 0;">
                                                <div class="input-field col s8">
                                                    <select id="schulungen" multiple required="required">
                                                        <option value="" disabled selected>Schulungen wählen</option>
                                                        <option value="1">Hallenkran</option>
                                                        <option value="2">Hebebühne</option>
                                                        <option value="3">Stapler</option>
                                                    </select>
                                                    <label>Schulungen</label>
                                                </div>
                                                <div class="input-field col s4">
                                                    <input id="teilnehmer" type="number" class="validate">
                                                    <label for="teilnehmer">Teilnehmer</label>
                                                </div>
                                            </div>
                                            <div class="row" style="margin-bottom: 0;">
                                                <div class="input-field col s12">
                                                    <textarea id="komentar" class="materialize-textarea validate"></textarea>
                                                    <label for="komentar">Komentar (optional)</label>
                                                </div>
                                            </div>
                                            <div class="row" style="margin-bottom: 0;">
                                                <div class="col s12" style="margin-bottom: 0;">
                                                    <div id="request"
                                                        class="btn waves-effect waves-light white indigo-text text-darken-3">
                                                        Absenden
                                                        <i class="material-icons right">send</i>
                                                    </div>
                                                </div>
                                            </div>
                                            <script>
                    $(document).ready(function () {

                        $('.collapsible').collapsible();
                        $('select').formSelect();

                        $.ajaxSetup({
                            beforeSend: function (xhr, settings) {
                                function getCookie(name) {
                                    var cookieValue = null;
                                    if (document.cookie && document.cookie != '') {
                                        var cookies = document.cookie.split(';');
                                        for (var i = 0; i < cookies.length; i++) {
                                            var cookie = jQuery.trim(cookies[i]);
                                            // Does this cookie string begin with the name we want?
                                            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                                                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                                                break;
                                            }
                                        }
                                    }
                                    return cookieValue;
                                }
                                if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
                                    // Only send the token to relative URLs i.e. locally.
                                    xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
                                }
                            }
                        });
                    
                    
                        $('.datepicker').datepicker({ "format": "yyyy-m-d" });
                    
                        function get_angebot_inputs() {

                            var slug = window.location.href.split('/')[3];
                            if(!slug){
                                slug = 'home';
                            }

                            return {
                                'name': $('#name').val(),
                                'firma': $('#firma').val(),
                                'email': $('#email').val(),
                                'phone': $('#phone').val(),
                                'postleitzahl': $('#postleitzahl').val(),
                                'schulungen': $('#schulungen').val(),
                                'teilnehmer': $('#teilnehmer').val(),
                                'komentar': $('#komentar').val(),
                                'slug': slug,
                            };
                        }
                    
                        function check_angebot_inputs() {
                           
                            if($('#name').val()){
                                $('#name').removeClass("invalid")
                                $('#name').addClass("valid")
                            }else{
                                $('#name').removeClass("valid")
                                $('#name').addClass("invalid")
                            }
                    
                            if($('#firma').val()){
                                $('#firma').removeClass("invalid")
                                $('#firma').addClass("valid")
                            }else{
                                $('#firma').removeClass("valid")
                                $('#firma').addClass("invalid")
                            }
                    
                            if($('#email').hasClass( "valid" )){
                                $('#email').removeClass("invalid")
                                $('#email').addClass("valid")
                            }else{
                                $('#email').removeClass("valid")
                                $('#email').addClass("invalid")
                            }
                    
                            if($('#postleitzahl').val()){
                                $('#postleitzahl').removeClass("invalid")
                                $('#postleitzahl').addClass("valid")
                            }else{
                                $('#postleitzahl').removeClass("valid")
                                $('#postleitzahl').addClass("invalid")
                            }
                    
                            if($('#phone').val()){
                                $('#phone').removeClass("invalid")
                                $('#phone').addClass("valid")
                            }else{
                                $('#phone').removeClass("valid")
                                $('#phone').addClass("invalid")
                            }
                    
                            if($('#schulungen').val().length){
                                console.log("val"+$('#schulungen').val().length);
                                $('.select-wrapper input.dropdown-trigger').removeClass("invalid")
                                $('.select-wrapper input.dropdown-trigger').addClass("valid")
                            }else{
                                console.log("noval"+$('#schulungen').val().lenght);
                                $('.select-wrapper input.dropdown-trigger').removeClass("valid")
                                $('.select-wrapper input.dropdown-trigger').addClass("invalid")
                            }
                    
                            if($('#teilnehmer').val()){
                                $('#teilnehmer').removeClass("invalid")
                                $('#teilnehmer').addClass("valid")
                            }else{
                                $('#teilnehmer').removeClass("valid")
                                $('#teilnehmer').addClass("invalid")
                            }
                    
                            if($('#name').val() &&
                            $('#firma').val() &&
                            $('#email').hasClass("valid") &&
                            $('#postleitzahl').val() && 
                            $('#schulungen').val().length && 
                            $('#phone').val() && 
                            $('#teilnehmer').val()){
                                return true;
                            }
                        }
                    
                        $('#request').click(function () {
                            if (check_angebot_inputs()) {
                                console.log(get_angebot_inputs());
                                user_data = get_angebot_inputs();
                                $.ajax({
                                    type: "POST",
                                    url: "/request",
                                    dataType: 'json',
                                    contentType: 'application/json; charset=utf-8',
                                    data: JSON.stringify(user_data),
                                    success: function (result) {
                                        window.location.href = '/danke';
                                  
                                    }
                                });
                            }
                        });
                    });
                    </script>
                                        </form>
                                    </div>
                                </div>
                            </div>
        
                            <div class="col s12" style="padding: 0rem 0rem 0rem 0rem;">
                                <ul class="collapsible">
                                    <li>
                                        <div class="collapsible-header"><i class="material-icons">info</i>Für welche Krane gilt
                                            die Kranschulung?</div>
                                        <div class="collapsible-body"><span>Die Kranschulung gilt für Hallenkrane und
                                                Brückenkrane und <b>nicht für Baukrane</b>. An einer Unterweisung für
                                                LKW-Laderkrane wird gearbeitet</span></div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>`,
                    attributes: {
                        class: 'fa fa-window-maximize'
                    }
                });

                $.ajax({
                    method: 'GET', 
                    url: '/get_blocks/',
                    success: function (data) {
                        var blocks = data['blocks'];
                        var blockManager = editor.BlockManager;
                        for(var i = 0; i < blocks.length; i++){
                            console.log(blocks[i]);
                            console.log(blocks[i].identifier);

                            blockManager.add(blocks[i].identifier, {
                                label: blocks[i].label,
                                category: blocks[i].category,
                                attributes: {
                                    class: 'fa '+blocks[i].fa_icon,
                                },
                                content: blocks[i].content,
                            });
                        }
                    }
                });
    
                window.id_variable = '_' + Math.random().toString(36).substr(2, 9);
    
                editor.on("component:add", function () {
                    console.log("block added");
    
                    window.id_variable = '_' + Math.random().toString(36).substr(2, 9);
                    console.log(window.id_variable);
                    // do stuff here
                });
    
                editor.render();
            }
    
    
        });
    
        $('#builder_editorbutton').removeClass('not_selected');
        $('#builder_editorbutton').addClass('selected');
        $('#normal').addClass('not_selected');
        $('#normal').removeClass('selected');
        $('#code_editorbutton').removeClass('selected');
        $('#code_editorbutton').addClass('not_selected');
    }
});