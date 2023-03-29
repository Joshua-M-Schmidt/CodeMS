(function(jQuery){
    window.front_edit_plugin = {

        target: null,
        editor: null,
        element_id: null,

        // Returns the html that will contain the editor
        get_container_html: function(element_id, front_edit_options) {
            this.element_id = element_id;
            return '<div class="front-edit-container" style="height:100vh;" id="edit-'+ this.element_id +'"></div>';
        },



        // initializes the editor on the target element, with the given html code
        set_html: function(target, html, front_edit_options) {
            $('link[rel=stylesheet][href*="materialize"]').remove();
            $('#admin_panel').css('display','none');
            $('#should_hide').css('display','none');
            var element = $('#admin_panel').detach();
            $('#bottom_admin_panel').append(element);
            $('#admin_panel').css('position','static');

            var this_ = this;
            this_.target = target;
            jQuery.getScript('https://cdnjs.cloudflare.com/ajax/libs/ace/1.1.9/ace.js', function(){
                this_.target.addClass('front-edit-ace');
                this_.editor = ace.edit("edit-" + this_.element_id);
                this_.editor.setTheme("ace/theme/monokai");
                this_.editor.$blockScrolling = Infinity;
                var val = html_beautify(html);
                this_.editor.setValue(val, -1);
                this_.editor.getSession().setMode("ace/mode/html");
                this_.editor.getSession().setUseWrapMode(true);
            });
        },

        // returns the edited html code
        get_html: function(front_edit_options) {
            $("head link[rel='stylesheet']").last().after("<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css' type='text/css'>");
            $('#admin_panel').css('display','block');
            $('#should_hide').css('display','inline');
            var element = $('#admin_panel').detach();
            $('#admin_panel_top_parent').append(element);
            $('#admin_panel').css('position','absolute');

            return this.editor.getValue();
        },

        // destroy the editor
        destroy_editor: function() {
            self.target = null;
            self.editor = null;
            self.element_id = null;
        }

    };
})(jQuery);