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

use Joomla\CMS\Session\Session;

defined('_JEXEC') or die;

class plgJshoppingProductsQuickOrder extends JPlugin {
    private $version = '4.4.1' ;
	private $addonParams;
	private $addonForm;
    /**
     * @var mixed|null
     * @since version
     */
    protected $formType;


    private function _init( $Ajax = false ) {
		if (!$this->addonParams) {
            $app = \Joomla\CMS\Factory::getApplication() ;
            $doc = \Joomla\CMS\Factory::getDocument();
            $controller = $app->input->get('controller' , false ) ;
            $category_id = $app->input->get('category_id' , false ) ;
            $product_id = $app->input->get('product_id' , false ) ;
            if( !$Ajax )
            {
                
                $this->_getPluginVersion();
                $quickorderParams = [
                    // Версия плагина
                    'version' => $this->version         ,
                    'debug'         =>  $this->params->get('debug_on' , false ) ,


                    'controller'    =>  $controller     ,
                    'category_id'   =>  $category_id    ,
                    'product_id'    =>  $product_id     ,
                    // Класс для доступной кнопки
                    'quickorderBtnOn' => 'quickorder-on' ,
                    // Параметры для обработчика форм
                    'FormsDriver' =>[
                        // Класс для неактивной кнопки
                        'btnOff' => 'off',

                    ],
                    // Ключ для Session Storage
                    'sessionStorageKey' => 'Quickorder' ,
                    'phoneMask' => $this->params->get('phoneMask' , '+7 (000) 000-00-00' )  ,
                    'selectors' => [
                        // Css селектор карточеи товара на странице категории
                        // этот элемент должен содеражать атребуты
                        // data-product_id и data-category_id ,
                        'blockProduct' => '.list_product .block_product-item > div' ,
                        // Селектор кнопки быстрого заказа
                        'quickorderBtn' => '.quickorder.btn',
                        // Селектор поля телефона для установки маски
                        'phoneMaskElement' => '.jmp__input_tel[name="phone"]',

                    ],
                    'Fancybox'=>[
                        'TimeOutModalAccept'=> ( $this->params->get('TimeOutModalAccept' , 8 ) * 1000 ) ,
                    ],
                ];




                # Критичиские стили для кнопки "Быстрый заказ"
                $doc->addScriptOptions('quickorder' , $quickorderParams);
                $pathCss = JPATH_PLUGINS . '/jshoppingproducts/quickorder/assets/css/critical.css' ;
                $paramsAddIncludeDeclaration = [
                    'debug' => $this->params->get('debug_on' , false ) ,
                ] ;
                \GNZ11\Document\Document::addIncludeStyleDeclaration( $pathCss , $paramsAddIncludeDeclaration ) ;

                // Скрипт инициализации
                $pathScript = JPATH_PLUGINS . '/jshoppingproducts/quickorder/assets/js/critical.category.js' ;
                if( $controller == 'product' )
                {
                    $pathScript = JPATH_PLUGINS . '/jshoppingproducts/quickorder/assets/js/critical.product.js' ;
                    $doc = \Joomla\CMS\Factory::getDocument();

                    $doc->addStyleDeclaration("
                        .l-get-discount span.l-get-form-btn.get-discount:after {
                            content: '" . $this->params->get('GetDiscountBtnText', 'Нашли дешевле? Снизим цену!') . "';
                        }
                        .l-get-discount.off span.l-get-discount-btn:after {
                            content: '" . $this->params->get('GetDiscountBtnTextAfter', 'Заявка для получения скидки оформлена') . "';
                        }
                    ");

                } #END IF

                \GNZ11\Document\Document::addIncludeScriptDeclaration( $pathScript , $paramsAddIncludeDeclaration ) ;

            }else{
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
                $this->addonForm = null;

                if( $Ajax )
                {
                    ob_start();
                    if( is_file(__DIR__ . '/tmpl/form.custom.php') )
                    {
                        include __DIR__ . '/tmpl/form.custom.php';
                    }
                    else
                    {
                        include __DIR__ . '/tmpl/form.php';
                    }
                    $this->addonForm = ob_get_contents();
                    ob_end_clean();
                } #END IF
//


				if ($this->addonParams->load_assets) {
                    # Установка надписей на кнопках
				    $doc->addStyleDeclaration("
				        .quickorder-on .quickorder:before{
                            content: '".$this->params->get('btnProductText', 'Быстрый заказ')."';
                        }
                        .quickorder-ordered .quickorder:before{
                            content: '".$this->params->get('btnProductOrdered', 'Заказ оформлен')."';
                        }
				    ");







					# Todo передать в quickorder.driver.js
					$doc->addScript(JURI::base(true).'/plugins/jshoppingproducts/quickorder/assets/script.js');
					$doc->addStyleSheet(JURI::base(true).'/plugins/jshoppingproducts/quickorder/assets/css/style.css');
				}
			}
		}
	}



	function onAfterRender() { }

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

    /**
     * Получени объекта продукта
     * @param $product_id
     * @param $category_id
     *
     * @return array
     *
     * @since version
     */
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
            'name' => $product->{'name_ru-RU'} ,
            'product_ean' => $product->product_ean ,
            'image' => ['thumb' => $image_path . $images[0]->{'image_thumb'},
                'title' => $images[0]->{'_title'},],];
        return $ret;
    }


    /**
     * Загрузка контактных форм и обработка ответа
     *
     * @since version
     */
    public function onAjaxGetExtensionsForm (){
        $app = \Joomla\CMS\Factory::getApplication() ;
        $method = $app->input->get('method' , false );
        $this->formType = $app->input->get('formType' , false );
        $this->template = $app->input->get('template' , 'forms_extensions' );
        $formType = $app->input->get('formType' , 'GetDiscount' );

        $product_id = $app->input->get('product_id' ,false ) ;
        $category_id = $app->input->get('category_id' ,false ) ;
        $this->productData = $this->_getProduct( $product_id , $category_id );


        $this->DataTemplate = [] ;
        switch ($formType){

            default :

                $this->DataTemplate = [
                    'title' => 'Заявка на скидку ',
                ];
        }

        $result['html'] = $this->loadTemplate( $this->template ) ;

        $result['params'] = [
            'theme'         =>  $this->params->get('theme' , 'light' ) ,
            'recaptcha_site_key'         =>  $this->params->get('recaptcha_site_key' , 'false' ) ,
        ];

        echo new JResponseJson($result);
        die( );

    }

    /**
     * Отправка данных форм на Email
     *
     * @throws Exception
     * @since version
     */
    public function onAjaxSend(){

        if (!Session::checkToken() && !Session::checkToken( 'get' ) )
        {
            $this->securityFalid();
        }#END IF




        
        $app = \Joomla\CMS\Factory::getApplication() ;
        
        $arrayFields = [
           'subject'     =>  'STRING',
           'l_name'     =>  'STRING',
           'phone'      =>  'STRING',
           'email'      =>  'RAW',
           'message'    =>  'STRING',
           'product'    =>  'STRING',
           'product_ean'    =>  'STRING',
           't'    =>  'INT',
           'ts'    =>  'INT',

        ];
        $this->Data = $app->input->getArray( $arrayFields , null );

        $this->Data['deltaT'] = ($this->Data['t'] - $this->Data['ts'])/1000 ;
        if ( $this->Data['deltaT'] < $this->params->get('time_form_level') )
        {
            $this->securityFalid();
        }#END IF
        
        $secret = $this->params->get('recaptcha_secret_key') ;

        $token = $app->input->get('grecaptcha' , false ) ;

        # Проверка рекапча Google V3
        $result = $this->VerifyGoogleRecaptcha( $secret , $token ) ;
        $this->Data['RecaptchaScore'] = $result->score ;
        if ( !$result->success || $result->score < $this->params->get('recaptcha_level') )
        {
            $this->securityFalid();
        }#END IF




        $EmailRecipient = $this->params->get('GetDiscountEmailRecipient') ;

        $mailer = \Joomla\CMS\Factory::getMailer();
        $config = \Joomla\CMS\Factory::getConfig();

        $sender = array(
            $config->get( 'mailfrom' ),
            $config->get( 'fromname' )
        );
        $recipient = array( $EmailRecipient /*, 'sad.net79@gmail.com'*/ );
        $mailer->addRecipient($recipient);

        // Create the Mail
        $body = $this->loadTemplate( 'ajax_send' ) ;

        $mailer->setSubject( $this->Data['subject'] );
        $mailer->isHtml(true);
        $mailer->Encoding = 'base64';
        $mailer->setBody($body);

        //         Optional file attached
        //        $mailer->addAttachment(JPATH_COMPONENT.'/assets/document.pdf');
        $send = $mailer->Send();
        if( $send !== true )
        {
            $this->Data['html'] = 'Не удалось создать заказ';
        }
        else
        {
            $this->Data['html'] = 'Спасибо, заказ принят. Ждите звонка';
        }

        echo new JResponseJson($this->Data);
        die();
    }

    /**
     * Проверка рекапча Google V3
     * @param $secret string Секретный ключ
     * @param $token string токен с фронта
     * @return Object   stdClass
     * @since 3.9
     * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date 22.09.2020 10:51
     */
    protected function VerifyGoogleRecaptcha(string $secret, string $token){
        $ch = curl_init();
        $curlConfig = array(
            CURLOPT_URL            => "https://www.google.com/recaptcha/api/siteverify",
            CURLOPT_POST           => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POSTFIELDS     => array(
                'secret' => $secret,
                'response' => $token,
                'remoteip' => $_SERVER['REMOTE_ADDR']
            )
        );
        curl_setopt_array($ch, $curlConfig);
        $result = curl_exec($ch);
        curl_close($ch);
        $result = json_decode($result);
        return $result ;
    }

    /**
     * Загрузка формы - Ajax
     *
     * @since version
     */
    public function onAjaxQuickOrder(){


        $app = \Joomla\CMS\Factory::getApplication() ;
        $method = $app->input->get('method' , false );
        if( $method )
        {
            $this->{'onAjax'.$method}();
            return ;
        }#END IF

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

    /**
     * Получить версию плагина из XML файла
     *
     * @since version
     */
    private function _getPluginVersion(){
        $file = \Joomla\CMS\Filesystem\File::stripExt( basename(__FILE__)  );
        $xml_file = __DIR__ .'/'.$file.'.xml';
        $dom = new DOMDocument("1.0", "utf-8");
        $dom->load($xml_file);
        $version = $dom->getElementsByTagName('version')->item(0)->textContent;
        $this->version = $version ;
    }

    /**
     * Если проверка безопасности не пройдена
     * @since 3.9
     * @auhtor Gartes | sad.net79@gmail.com | Skype : agroparknew | Telegram : @gartes
     * @date 22.09.2020 10:54
     *
     */
    public function securityFalid(): void
    {
        $this->Data['html'] = 'Защита не пройдена';
        echo new JResponseJson($this->Data);
        die();
    }


}