(function (jQuery) {

    

    var id = '_' + Math.random().toString(36).substr(2, 9);

    window.front_edit_plugin = {

        element_id: null,
        editor: null,

        // Returns the html that will contain the editor
        get_container_html: function (element_id, front_edit_options) {
            this.element_id = "edit-" + element_id;
            return '<div id="' + this.element_id + '"></div>';
            //return '<div id="gjs"><div class="txt-red">Hello world!</div><style>.txt-red{color: red}</style></div>'
        },

        // initializes the editor on the target element, with the given html code
        set_html: function (target, html, front_edit_options) {
            $('link[rel=stylesheet][href*="materialize"]').remove();
            $('#admin_panel').css('display','none');
            $('#should_hide').css('display','none');
            var element = $('#admin_panel').detach();
            $('#bottom_admin_panel').append(element);
            $('#admin_panel').css('position','static');
            
            jQuery('#' + this.element_id).html(html);
            console.log(html);

            this.editor = grapesjs.init({
                showOffsets: 1,
                forceClass: true,
                container: '#' + this.element_id,
                height: '90vh',
                width: 'auto',
                fromElement: true,
                allowScripts: 1,
                plugins: ['grapesjs-style-gradient'],
                pluginsOpts: {
                    'grapesjs-style-gradient': {
                        colorPicker: 'default',
                        grapickOpts: {
                            min: 1,
                            max: 99,
                        }
                    },
                    'grapesjs-custom-code': {

                    }
                },
                storageManager: false,
                canvas: {
                    styles: ['https://fonts.googleapis.com/css?family=Roboto', 
                    'https://fonts.googleapis.com/icon?family=Material+Icons', 
                    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css', 
                    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
                    'https://unpkg.com/materialize-stepper@3.1.0/dist/js/mstepper.min.js'],
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
                        }],
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
                    }, {
                        name: 'Mobile',
                        width: '320px', // this value will be used on canvas width
                        widthMedia: '480px', // this value will be used in CSS @media
                    }]
                },
            });

            this.editor.StyleManager.addProperty('decorations', {
                name: 'Gradient',
                property: 'background-image',
                type: 'gradient',
                defaults: 'none'
            }, 0);

            var blockManager = this.editor.BlockManager;
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
                padding: 7px;" src="http://unterweisungen-e354.kxcdn.com/KMS_Logos_white.png"><br>
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
            blockManager.add('blog', {
                label: 'Blog',
                category: 'Section',
                content: '<section id="blog" class="container">'
                    + '<div class="row">'
                    + '<div class="col s12">'
                    + '<h2 class="section-title center">Blog</h2>'
                    + '</div>'
                    + '<div class="col s12 m6">'
                    + '<div class="blogpost">'
                    + '<div class="date">'
                    + '22 / July / 18'
                    + '</div>'
                    + '<a href="#">'
                    + '<div class="img-wrap"><img src="https://cdn.pixabay.com/photo/2015/03/17/02/01/cubes-677092__480.png" alt=""></div>'
                    + '<h3 class="title">Blog Title</h3>'
                    + '</a>'
                    + '<div class="blogmeta">'
                    + '<ul>'
                    + '<li><i class="material-icons">person_outline</i><span> by John Doe</span></li>'
                    + '<li>'
                    + '<i class="material-icons">chat_bubble_outline</i> <span>5 Comments</span>'
                    + '</li> '
                    + '</ul>'

                    + '</div>'

                    + '<p class="content">'
                    + 'Nulla porttitor accumsan tincidunt. Vivamus suscipit tortor eget felis porttitor volutpat. Sed porttitor lectus nibh. Proin eget tortor risus. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.'
                    + '</p>'
                    + '<a href="#" class="btn light-blue wave-effect">Read More</a>'
                    + '</div>'
                    + '</div>'
                    + '<div class="col s12 m6">'
                    + '<div class="blogpost">'
                    + '<div class="date">'
                    + '22 / July / 18'
                    + '</div>'
                    + '<a href="#">'
                    + '<div class="img-wrap"><img src="https://cdn.pixabay.com/photo/2013/07/25/13/01/stones-167089__480.jpg" alt=""></div>'
                    + '<h3 class="title">Blog Title</h3>'
                    + '</a>'
                    + '<div class="blogmeta">'
                    + '<ul>'
                    + '<li><i class="material-icons">person_outline</i><span> by John Doe</span></li>'
                    + '<li>'
                    + '<i class="material-icons">chat_bubble_outline</i> <span>5 Comments</span>'
                    + '</li> '
                    + '</ul>'

                    + '</div>'

                    + '<p class="content">'
                    + 'Nulla porttitor accumsan tincidunt. Vivamus suscipit tortor eget felis porttitor volutpat. Sed porttitor lectus nibh. Proin eget tortor risus. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.'
                    + '</p>'
                    + '<a href="#" class="btn light-blue wave-effect">Read More</a>'
                    + '</div>'
                    + '</div>'
                    + '</div><!-- row -->'
                    + '</section><!-- container -->'
                    + '<style>.section-title{margin:40px 0 40px}.blogpost{border:1px solid #eee;padding:20px;position:relative;margin-bottom:30px}.blogpost .date{z-index:2;position:absolute;background:#fff;padding:8px;box-shadow:0 1px 3px rgba(116,116,116,.3);-moz-box-shadow:0 1px 3px rgba(116,116,116,.3);-webkit-box-shadow:0 1px 3px rgba(116,116,116,.3);top:40px;right:-4px}.blogpost .img-wrap{width:100%;overflow:hidden;height:240px}.blogpost .img-wrap img{width:100%;object-fit:cover;height:100%;transition:all ease .4s;-moz-transition:all ease .4s;-webkit-transition:all ease .4s}.blogpost .img-wrap:hover img{transform:scale(1.1);-moz-transform:scale(1.1);-webkit-transform:scale(1.1)}.blogpost .title{color:#222;font-size:28px}.blogmeta{width:100%;clear:both;margin-bottom:10px}.blogmeta ul li{position:relative;width:50%}.blogmeta ul li span{position:absolute;top:4px;left:28px;margin-bottom:10px}@media (min-width:768px){.blogmeta ul li{float:left}}</style>',
                attributes: {
                    class: "fa fa-dedent"
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
                content: '<footer class="page-footer light-blue gram-footer">' +
                    '<div class="container">' +
                    '<div class="row">' +
                    '<div class="col l6 s12">' +
                    '<h5 class="white-text">Company Bio</h5>' +
                    '<p class="grey-text text-lighten-4">We are a team of college students working on this project like its our full time job.Any amount would help support and continue development on this project and is greatly appreciated. </p>' +
                    '</div>' +
                    '<div class="col l3 s12">' +
                    '<h5 class="white-text">Settings</h5>' +
                    '<ul class="collection light-blue">' +
                    '<li class="collection-item"><a class="white-text" href="#!">Link 1</a></li>' +
                    '<li class="collection-item"><a class="white-text" href="#!">Link 2</a></li>' +
                    '<li class="collection-item"><a class="white-text" href="#!">Link 3</a></li>' +
                    '<li class="collection-item"><a class="white-text" href="#!">Link 4</a></li>' +
                    '</ul>' +
                    '</div>' +
                    '<div class="col l3 s12">' +
                    '<h5 class="white-text">Connect</h5>' +
                    '<ul class="collection light-blue with-header">' +
                    '<li class="collection-item"><a class="white-text" href="#!">Link 1</a></li>' +
                    '<li class="collection-item"><a class="white-text" href="#!">Link 2</a></li>' +
                    '<li class="collection-item"><a class="white-text" href="#!">Link 3</a></li>' +
                    '<li class="collection-item"><a class="white-text" href="#!">Link 4</a></li>' +
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

            window.id_variable = '_' + Math.random().toString(36).substr(2, 9);

            this.editor.on("component:add", function () {
                console.log("block added");

                window.id_variable = '_' + Math.random().toString(36).substr(2, 9);
                console.log(window.id_variable);
                // do stuff here
            });

            this.editor.render();
        },

        // returns the edited html code
        get_html: function (front_edit_options) {
            var htmlCss = this.editor.getHtml() + "<style>" + this.editor.getCss() + "</style>";
            console.log(htmlCss);
            $("head link[rel='stylesheet']").last().after("<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css' type='text/css'>");
            $('#admin_panel').css('display','block');
            $('#should_hide').css('display','inline');
            var element = $('#admin_panel').detach();
            $('#admin_panel_top_parent').append(element);
            $('#admin_panel').css('position','absolute');
            return htmlCss;
        },

        // destroy the editor
        destroy_editor: function () {
            this.editor = null;
            this.element_id = null;
        }
    };
})(jQuery);