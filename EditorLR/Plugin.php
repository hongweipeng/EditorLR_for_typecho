<?php
if (!defined('__TYPECHO_ROOT_DIR__')) exit;
/**
 * 将编辑器左右分的神器
 * 
 * @package EditorLR 
 * @author hongweipeng
 * @version 0.7.1
 * @link http://blog.west2online.com
 */
class EditorLR_Plugin implements Typecho_Plugin_Interface
{
    /**
     * 激活插件方法,如果激活失败,直接抛出异常
     * 
     * @access public
     * @return void
     * @throws Typecho_Plugin_Exception
     */
    public static function activate() {
        Typecho_Plugin::factory('admin/write-post.php')->bottom = array(__CLASS__, 'render');
        Typecho_Plugin::factory('admin/write-page.php')->bottom = array(__CLASS__, 'render');
    }
    
    /**
     * 禁用插件方法,如果禁用失败,直接抛出异常
     * 
     * @static
     * @access public
     * @return void
     * @throws Typecho_Plugin_Exception
     */
    public static function deactivate(){}
    
    /**
     * 获取插件配置面板
     * 
     * @access public
     * @param Typecho_Widget_Helper_Form $form 配置面板
     * @return void
     */
    public static function config(Typecho_Widget_Helper_Form $form) {}
    
    /**
     * 个人用户的配置面板
     * 
     * @access public
     * @param Typecho_Widget_Helper_Form $form
     * @return void
     */
    public static function personalConfig(Typecho_Widget_Helper_Form $form){}
    
    /**
     * 插件实现方法
     * 
     * @access public
     * @return void
     */
    public static function render() {
        $options        = Helper::options();
        $cssUrl         = Typecho_Common::url('EditorLR/lr.css', $options->pluginUrl);
        $jsUrl          = Typecho_Common::url('EditorLR/prettify.js', $options->pluginUrl);
        $lrjs          = Typecho_Common::url('EditorLR/lr.js', $options->pluginUrl);

        echo <<<HTML
            <link rel="stylesheet" type="text/css" href="{$cssUrl}" />
            <script type="text/javascript" src="{$jsUrl}"></script>
            <script type="text/javascript" src="{$lrjs}"></script>
HTML;
    }
}
