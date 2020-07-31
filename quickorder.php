<?php
/**
* @package Joomla
* @subpackage JoomShopping
* @author Nevigen.com
* @website https://nevigen.com/
* @email support@nevigen.com
* @copyright Copyright � Nevigen.com. All rights reserved.
* @license Proprietary. Copyrighted Commercial Software
* @license agreement https://nevigen.com/license-agreement.html
**/

defined('_JEXEC') or die;

class plgJshoppingProductsQuickOrder extends JPlugin {
    private $version = '4.4.1' ;
	private $addonParams;
	private $addonForm;



    private function _init( $Ajax = false ) {
		if (!$this->addonParams) {
            if( !$Ajax )
            {
                $pathCss = JPATH_PLUGINS . '/jshoppingproducts/quickorder/assets/css/critical.css' ;
                $paramsCss = [
                    'debug' => $this->params->get('debug_on' , false ) ,
                ] ;
                \GNZ11\Document\Document::addIncludeStyleDeclaration( $pathCss , $paramsCss ) ;
            }else{
                $app = \Joomla\CMS\Factory::getApplication() ;
                $product_id = $app->input->get('product_id' ,false ) ;
                $category_id = $app->input->get('category_id' ,false ) ;
                $this->productData = $this->_getProduct( $product_id , $category_id );
                $this->productHtml = $this->loadTemplate('product');
            }#END IF


			JFactory::getLanguage()->load('plg_jshoppingproducts_quickorder', JPATH_SITE.'/plugins/jshoppingproducts/quickorder', null, false, 'en-GB');
			$addon = JTable::getInstance('Addon', 'jshop');
			$addon->loadAlias('addon_quickorder');
			$this->addonParams = (object)$addon->getParams();
			if ($this->addonParams->enable) {
				$adv_user = JSFactory::getUser();
				ob_start();
                    if (is_file(__DIR__ . '/tmpl/form.custom.php')) {
                        include __DIR__ . '/tmpl/form.custom.php';
                    } else {
                        include __DIR__ . '/tmpl/form.php';
                    }
                    $this->addonForm = null ;
                    if ($Ajax) {
                        $this->addonForm = ob_get_contents();
                    }else{

                    }#END IF
//                    $this->addonForm = ob_get_contents();
				ob_end_clean();

				if ($this->addonParams->load_assets) {
					$doc = JFactory::getDocument();

                    $doc->addScriptDeclaration("
                        setTimeout(function () {
                            jQuery('.quickorder.btn').on('click.quickorder' , function () {
                                var Element = this ;
                                wgnz11.load.js( wgnz11.Options.Ajax.siteUrl+'plugins/jshoppingproducts/quickorder/assets/js/driver.js' ).then(function (a) {
                                    new QuickorderDriver(Element);
                                },function (err) { console.error(err)})
                            })
                        },2000);
                    ");

//					$doc->addScript(JURI::base(true).'/plugins/jshoppingproducts/quickorder/assets/driver.js');
					# Todo передать в driver.js
					$doc->addScript(JURI::base(true).'/plugins/jshoppingproducts/quickorder/assets/script.js');
					$doc->addStyleSheet(JURI::base(true).'/plugins/jshoppingproducts/quickorder/assets/css/style.css');
				}
			}
		}
	}

    function onAfterCartAddOk( $cart, $product_id, $quantity, $attribut, $freeattribut ){
//        echo'<pre>';print_r( $cart );echo'</pre>'.__FILE__.' '.__LINE__;
//        echo'<pre>';print_r( $product_id );echo'</pre>'.__FILE__.' '.__LINE__;
//        echo'<pre>';print_r( $quantity );echo'</pre>'.__FILE__.' '.__LINE__;
//        echo'<pre>';print_r( $attribut );echo'</pre>'.__FILE__.' '.__LINE__;
//        echo'<pre>';print_r( $freeattribut );echo'</pre>'.__FILE__.' '.__LINE__;

//        die(__FILE__ .' '. __LINE__ );

    }

	function onAfterRender() {
        if (!$this->addonForm) {
            return;
        }
        $app = JFactory::getApplication();
        $app->setBody(str_ireplace('</body>', $this->addonForm.'</body>', $app->getBody(false)));
    }

    function onBeforeDisplayProductView(&$view){
		$this->_init();
		if (!$this->addonParams->enable) {
			return;
		}
		if (!$this->addonParams->insert_var) {
			$this->addonParams->insert_var = '_tmp_product_html_buttons';
		}
		if (!isset($view->{$this->addonParams->insert_var})) {
			$view->{$this->addonParams->insert_var} = '';
		}
		ob_start();
		if (is_file(__DIR__ . '/tmpl/button_product.custom.php')) {
			include __DIR__ . '/tmpl/button_product.custom.php';
		} else {
			include __DIR__ . '/tmpl/button_product.php';
		}
		$view->{$this->addonParams->insert_var} .= ob_get_contents();  
		ob_end_clean();
	}

    function onBeforeDisplayProductList(&$products){
		$this->_init();
		if (!$this->addonParams->enable || !$this->addonParams->show_in_list) {
			return;
		}
		if (!$this->addonParams->insert_var_list) {
			$this->addonParams->insert_var_list = '_tmp_var_buttons';
		}
		foreach ($products as $key=>$product) {
			if (!isset($products[$key]->{$this->addonParams->insert_var_list})) {
				$products[$key]->{$this->addonParams->insert_var_list} = '';
			}
			ob_start();
			if (is_file(__DIR__ . '/tmpl/button_list.custom.php')) {
				include __DIR__ . '/tmpl/button_list.custom.php';
			} else {
				include __DIR__ . '/tmpl/button_list.php';
			}
			$products[$key]->{$this->addonParams->insert_var_list} .= ob_get_contents();  
			ob_end_clean();
		}
	}

	private function _getProduct( $product_id , $category_id  )
    {
        $jshopConfig = JSFactory::getConfig();
        $image_path = '/components/com_jshopping/files/img_products/';
        $product = JSFactory::getTable('product', 'jshop');
        $product->load($product_id);
        $images = $product->getImages();
        $ret = [
            'product_id' => $product_id,
            'category_id' => $category_id,
            'name' => $product->{'name_ru-RU'},
            'image' => ['thumb' => $image_path . $images[0]->{'image_thumb'},
                'title' => $images[0]->{'_title'},],];
        return $ret;
    }

    /**
     * Загрузка формы - Ajax
     *
     * @since version
     */
    public function onAjaxQuickOrder(){
        /*$app = \Joomla\CMS\Factory::getApplication() ;
        $product_id = $app->input->get('product_id' ,false ) ;
        $category_id = $app->input->get('category_id' ,false ) ;
        $this->productData = $this->_getProduct( $product_id , $category_id );
        $this->productHtml = $this->loadTemplate('product');*/


	    try
	    {
            $this->_init(true);
            $result['form'] = $this->addonForm ;
            $result['params'] = $this->params ;

	        // Code that may throw an Exception or Error.
            echo new JResponseJson($result);
            die();

	        // throw new Exception('Code Exception '.__FILE__.':'.__LINE__) ;
	    }
	    catch (Exception $e)
	    {
	        // Executed only in PHP 5, will not be reached in PHP 7
	        echo 'Выброшено исключение: ',  $e->getMessage(), "\n";
	        echo'<pre>';print_r( $e );echo'</pre>'.__FILE__.' '.__LINE__;
	        die(__FILE__ .' '. __LINE__ );
	    }
    }
    /**
     * Загрузите файл макета плагина. Эти файлы могут быть переопределены с помощью стандартного Joomla! Шаблон
     *
     * Переопределение :
     *                  JPATH_THEMES . /html/plg_{TYPE}_{NAME}/{$layout}.php
     *                  JPATH_PLUGINS . /{TYPE}/{NAME}/tmpl/{$layout}.php
     *                  or default : JPATH_PLUGINS . /{TYPE}/{NAME}/tmpl/default.php
     *
     *
     * переопределяет. Load a plugin layout file. These files can be overridden with standard Joomla! template
     * overrides.
     *
     * @param string $layout The layout file to load
     * @param array  $params An array passed verbatim to the layout file as the `$params` variable
     *
     * @return  string  The rendered contents of the file
     *
     * @since   5.4.1
     * @todo Add temlate
     */
    private function loadTemplate ( $layout = 'default' )
    {
        $path = \Joomla\CMS\Plugin\PluginHelper::getLayoutPath( 'jshoppingproducts', 'quickorder', $layout );
        // Render the layout
        ob_start();
        include $path;
        return ob_get_clean();
    }


}