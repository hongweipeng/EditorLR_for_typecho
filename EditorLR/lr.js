//div 添加resize
(function($,h,c){var a=$([]),e=$.resize=$.extend($.resize,{}),i,k="setTimeout",j="resize",d=j+"-special-event",b="delay",f="throttleWindow";e[b]=250;e[f]=true;$.event.special[j]={setup:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.add(l);$.data(this,d,{w:l.width(),h:l.height()});if(a.length===1){g()}},teardown:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.not(l);l.removeData(d);if(!a.length){clearTimeout(i)}},add:function(l){if(!e[f]&&this[k]){return false}var n;function m(s,o,p){var q=$(this),r=$.data(this,d);r.w=o!==c?o:q.width();r.h=p!==c?p:q.height();n.apply(this,arguments)}if($.isFunction(l)){n=l;return m}else{n=l.handler;l.handler=m}}};function g(){i=h[k](function(){a.each(function(){var n=$(this),m=n.width(),l=n.height(),o=$.data(this,d);if(m!==o.w||l!==o.h){n.trigger(j,[o.w=m,o.h=l])}});g()},e[b])}})(jQuery,this);

function prettify() {
    $("pre").addClass("prettyprint");
    prettyPrint();
}

//滚动条添加监听 同步两边的滚动条
$(document).ready(function(){
    var syn = true;//防止两个滚动条相互监听而引起无穷无尽的死锁问题
    var is_syn_time = true;//是否实时
    var mode = 1;//当前编辑模式，默认为实时
    var is_process = false;//正在编辑器模式切换中
    function syn_scroll(source, target) {
        source.scroll(function(){
            if(!syn) return;
            syn = false;
            var source_scroll_top = source.scrollTop();
            var source_scroll_height = source.get(0).scrollHeight;
            var source_offset_height = source.get(0).offsetHeight;

            var target_offset_height = target.get(0).offsetHeight;
            var target_scroll_height = target.get(0).scrollHeight;

            target.scrollTop(source_scroll_top * (target_scroll_height - target_offset_height) / (source_scroll_height - source_offset_height));
            setTimeout(function(){
                syn = true;
            },20);
        });
    }
    var textArea = $('#text');
    var wmd_preview = $('#wmd-preview');
    syn_scroll(textArea, wmd_preview);
    syn_scroll(wmd_preview, textArea);

    $('.wmd-edittab').remove();
    wmd_preview.removeClass('wmd-hidetab');

    textArea.resize(function() {
        if(is_process)
            return;
        wmd_preview.outerHeight(textArea.outerHeight());
        $('.wmd-editlrtab a').eq(mode).click();
    });
    textArea.resize();//update resize

    setInterval(function() {
        if(!is_syn_time)//如果不是实时模式，不需要再对代码渲染
            return;
        prettify();
    }, 500);//代码高亮

    //添加编辑 实时 预览工具栏
    var div = $('<div class="wmd-editlrtab"></div>');
    var edit_mode = $('<a href="javascript:void(0);">编辑</a>');
    var both_mode = $('<a href="javascript:void(0);">实时</a>');
    var show_mode = $('<a href="javascript:void(0);">浏览</a>');
    div.append(edit_mode).append(both_mode).append(show_mode);
    $('#wmd-button-bar').prepend(div);

    //编辑器模式 0 编辑模式 1 实时模式 2 预览模式
    function edit_change(_m) {
        mode = _m;
        var left, right;
        is_process = true;
        if(mode == 0) {
            is_syn_time = false;
            left = 100;
            right = 10;
        }else if(mode == 1) {
            is_syn_time = true;
            if($('body').hasClass('fullscreen')) {
                left = right = 50;
            }else {
                left = right = 47;
            }
        }else if(mode == 2) {
            is_syn_time = false;

            if($('body').hasClass('fullscreen')) {
                left = 10;
                right = 100;
            }else {
                left = 0;
                right = 'full';
            }
        }


        $('.wmd-editlrtab a').removeClass("active");
        
        if(left < 15) {
            textArea.css('visibility','hidden');
        } else {
            textArea.css('visibility','visible');
        }

        if(right < 15) {
            wmd_preview.css('visibility','hidden');
        }else {
            wmd_preview.css('visibility','visible');
        }

        textArea.animate({width:left + '%'}, 200);
        if(typeof right == 'string') {
            wmd_preview.animate({width:(($('#wmd-editarea').width() - 15)/ $(window).width()) * 100 + '%'}, 200);
        } else {
            wmd_preview.animate({width:right + '%'}, 200);
        }

        $('.wmd-editlrtab a').eq(mode).addClass('active');

        setTimeout(function(){
                is_process = false;
            },500);
    }
    edit_mode.click(function() {
        edit_change(0);
    });
    both_mode.click(function() {
        edit_change(1);
    });
    show_mode.click(function() {
        edit_change(2);
    });

    both_mode.addClass('active');

});

