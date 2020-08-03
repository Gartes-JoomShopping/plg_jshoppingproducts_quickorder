var quickOrder = quickOrder || {};
quickOrder.__isLoad = false ;
quickOrder._start = function (event) {
    var $ = jQuery ;
    var self = this ;
    this.__group = 'jshoppingproducts' ;
    this.__plugin = 'quickorder' ;
    this.__params = Joomla.getOptions( this.__plugin , {} );
    /**
     * Параметры запроса для плагина
     * @type {{task: null, plugin: string, format: string, group: string, option: string}}
     */
    this.AjaxDefaultData = {
        group : this.__group,
        plugin : this.__plugin ,
        option : 'com_ajax' ,
        format : 'json' ,
        task : null ,
    }
    var _host = wgnz11.Options.Ajax.siteUrl ;

    console.log( event.target )

    var $product =  $(event.target).closest('.product') ;
    var elem = event.target ,
        cid =  $product.data('category_id'),
        pid =  $product.data('product_id');


    if (!quickOrder.__isLoad ){
        var Data = {} ;
        var data = $.extend( true , this.AjaxDefaultData , Data );
        data.task = 'getForm';

        wgnz11.getModul( "Ajax" ).then( function ( Ajax )
        {
            // Не обрабатывать сообщения
            Ajax.ReturnRespond = true;
            // Отправить запрос
           /* Ajax.send( data ).then( function ( r )
            {

                console.log( data )

                Promise.all([
                    // wgnz11.load.css( _host + 'plugins/jshoppingproducts/quickorder/assets/style.css') ,
                    // wgnz11.load.js( _host + 'plugins/jshoppingproducts/quickorder/assets/script.js') ,

                ]).then(function ( a)
                {



                    // $('body').append( r.data.form )
                    quickOrder.openForm(elem,cid,pid)
                })
            } , function ( err ) { console.error( err ) })*/
        });
    }
    console.log(event);

};
window.QuickorderDriver = function ( onElement ) {
    var $ = jQuery ;
    var self = this ;
    this.__group = 'jshoppingproducts' ;
    this.__plugin = 'quickorder' ;
    this.__param = Joomla.getOptions( this.__plugin , {} );
    // Ключ для sessionStorage
    this.sessionStorageKey = 'Quickorder' ;

    this.AjaxDefaultData = {
        group : this.__group,
        plugin : this.__plugin ,
        option : 'com_ajax' ,
        format : 'json' ,
        task : null ,
    };

    this.theme = null ;
    this.product_id = null ;
    this.category_id = null ;
    /**
     * родительский элемент обаертка
     * @type {null}
     */
    this.$parent_element = null ;

    this.selectors = {
        form : '#quickorderpopup form' ,
        btn : 'span.quickorder' ,
        phoneMaskElement : '.jmp__input_tel',
    };
    this.Init = function ()
    {
        console.log( this.__param )
        this.getParentElemet()
        this.getProduct()
        this.getForm();
    };
    /**
     * Определение родительского элемента в зависимости от страницы ( категория || товар )
     *
     */
    this.getParentElemet = function (){
        if (self.__param.controller === "product" ){
            self.$ElementProduct = $( self.__param.selectors.quickorderBtn ).parent() ;
            return ;
        }
        self.$ElementProduct = $(onElement).closest(self.__param.selectors.blockProduct );
    }
    /**
     * Получить данные о товаре ( category_id && product_id )
     *
     */
    this.getProduct = function () {
        if (self.__param.controller === "product" ){
            self.category_id = self.__param.category_id;
            self.product_id =self.__param.product_id;
            return ;
        }
        self.product_id = self.$ElementProduct.data('product_id')
        self.category_id = self.$ElementProduct.data('category_id')
    }
    /**
     * Загрузка формы быстрого заказа
     */
    this.getForm = function () {
        var __param = self.__param ;
        var modalFormQuickOrder ;
        var InputmaskSettings = {
            //  Шаблон маски поля
            // Can be '+38(000)000-00-00'
            mask  : self.__param.phoneMask ,
            element : self.selectors.phoneMaskElement ,
            onComplete : onMaskComplete ,
            onKeyPress: onMaskKeyPress ,
            // Can be true , false
            // Создавать placeholder из маски поля
            // placeholder :   true ,

            // Используется для масок телефонов
            // предназначен для загрузки иконок мобильных операторов
            // Can be 'UA'
            // country :   'UA',

        }
        var Data = {
            product_id : self.product_id ,
            category_id : self.category_id ,
        } ;
        var data = $.extend( true , this.AjaxDefaultData , Data );
        data.task = 'getForm';
        self.getModul( "Ajax" ).then( function ( Ajax ) {
            // Не обрабатывать сообщения
            Ajax.ReturnRespond = true;
            Ajax.send( data ).then(  renderForm )
        },function (err) { console.log(err)});
        function renderForm( r ) {
            self.theme = r.data.params.theme ;
            self.productHtml = r.data.product ;
            var html = r.data.form
            self.load.css( self.Options.Ajax.siteUrl+'plugins/jshoppingproducts/quickorder/assets/css/themes/'+self.theme+'.css' ).then(
                function () {
                    modalOpen(html)
                },function (err) { console.log(err) }
            );


        }
        /**
         * Включить отключить кнопку для отправки формы БЫСТРОГО ЗАКАЗА
         * Если эта форма не проходит валидацию
         * @param validResult
         * @constructor
         */
        function BtnControl(validResult) {
            var $btn = $(self.selectors.form).find('button[type="submit"]')
            if (validResult){
                $btn.removeClass('disabled')
            }else{
                $btn.addClass('disabled')
            }
        }
        /**
         * Валидация формы БЫСТРОГО ЗАКАЗА
         */
        function formValid() {
            var $required = $(self.selectors.form).find('[data-required]');
            var validResult = true ;

            $.each($required , function (i,a) {
                var val = $(a).val();
                if (!val.length || $(a).hasClass('error')) validResult = false ;
                if ( val.length ) {
                    $(a).addClass('no-empty')
                }else{
                    $(a).removeClass( 'no-empty' )
                }
            })
            if ( !$('.jmp__input_tel').hasClass('Mask-Complete') )  validResult = false ;

            BtnControl(validResult)
        }
        /**
         * Событие маска заполнена
         * @param val
         * @param event
         * @param currentField
         * @param d
         */
        function onMaskComplete(val , event , currentField , d) {
            $( currentField ).addClass('Mask-Complete');
            formValid();
            console.log( val )
            console.log( event )
            console.log( currentField )
            console.log( d )
        }
        /**
         * Событие нажатие кнопок маски
         * @param val
         * @param event
         * @param currentField
         * @param options
         */
        function onMaskKeyPress(val,event,currentField,options) {
            var maskDl = InputmaskSettings.mask.replace(/[^\d;]/g, '').length ;
            var valDl = val.replace(/[^\d;]/g, '').length ;
            if ( maskDl !== valDl ) {
                $(currentField).removeClass('Mask-Complete');
                BtnControl(false ) ;
            }
        }


        /**
         * Добавить данные заказа в сессию историю
         * @param orderDetail
         */
        function addHistoryAcceptOrder(orderDetail) {
            var QuickorderSesData = JSON.parse( sessionStorage.getItem(self.sessionStorageKey) );
            if (!QuickorderSesData) QuickorderSesData = {} ;

            if (typeof QuickorderSesData.order_id === 'undefined' ){
                QuickorderSesData.order_id = [] ;
            }
            if (typeof QuickorderSesData.product_id === 'undefined' ){
                QuickorderSesData.product_id = [] ;
            }

            QuickorderSesData.order_id.push( orderDetail.order_id ) ;
            QuickorderSesData.product_id.push( self.product_id ) ;

            sessionStorage.setItem(self.sessionStorageKey, JSON.stringify(QuickorderSesData) );
            console.log( QuickorderSesData.order_id )

        }

        /**
         * После принятия заказа сделать кнопку для быстрого заказа в товаре не активной
         */
        function quickorderBtnOff() {
            self.$ElementProduct.toggleClass(  'quickorder-on quickorder-ordered'   ).off( 'click.quickorder' );
        }
        /**
         * Показать окно с информацией - заказ принят
         * @param html
         */
        function modalOrderAcceptOpen(html) {
            console.log( self   )
            console.log( self.__params  )
            self.__loadModul.Fancybox().then(function (a) {
                a.open( html ,{
                    baseClass : "quickorderForm",
                    afterShow   : function(instance, current)   {
                        // Установка таймера Fancybox до закрытия
                       a.setTimeOut(self.__param.Fancybox.TimeOutModalAccept);
                        // После принятия заказа сделать кнопку для быстрого заказа не активной
                        quickorderBtnOff() ;

                    },
                })
            })
        }
        /**
         * Открыть модальное окно БЫСТРЫЙ ЗАКАЗ
         * @param html
         */
        function modalOpen(html) {
            // var h = $(html).find('.container-product').append( self.productHtml ).html() ;
            // console.log(h) ;

            var _maskInit = false ;
            self.__loadModul.Fancybox().then(function (a) {
                modalFormQuickOrder = a.open( html ,{
                    baseClass : "quickorderForm",
                    touch : false , // полностью отключить сенсорные жесты default : true
                    beforeShow   : function(instance, current)   {
                        // $('.container-product').append( self.productHtml )
                    },
                    afterShow   : function(instance, current)   {
                        var $form = $(self.selectors.form)
                        $form.find('[name="category_id"]').val( self.category_id );
                        $form.find('[name="product_id"]').val( self.product_id );

                        // Ставим маску на поле телефона
                        self.getPlugin('Inputmask'  ).then(function ( Inputmask ) {
                            var $inputPhone = $(InputmaskSettings.element) ;
                            $inputPhone.on('focus._maskInit',function () {
                                Inputmask.Inint( InputmaskSettings.element , InputmaskSettings );
                                $inputPhone.off('focus._maskInit');
                                $inputPhone.focus()
                            });
                        });
                        $form.find( 'input[type="text"]' ).on( 'keyup' , formValid );
                        $form.find('label').on('click',function (){
                            $(this).parent().find('input[type="text"]').focus();
                        })
                        // Отправка формы
                        $form.on('submit.quickorderForm' , function (event) {
                            event.preventDefault();
                            var $form = $(this);
                            var Data = $form.serialize();
                            self.getModul( "Ajax" ).then( function ( Ajax )
                            {
                                // Не обрабатывать сообщения
                                Ajax.ReturnRespond = true;
                                // Отправить запрос
                                Ajax.send( Data ).then( function ( r )
                                {
                                    modalFormQuickOrder.close();
                                    modalOrderAcceptOpen(r.data.html);
                                    // Добавить данные заказа в сессию историю
                                    addHistoryAcceptOrder(r.data.orderDetail)
                                } , function ( err ){ console.error( err ) })
                            });

                        });

                        // Для мобильных устройств
                        if ( !a.isMobile ) return  ;
                        return  ;
                        // Елемент контента Fancybox
                        var $parentFormElement = $form.closest('.fancybox-content')
                        var $inputs = $form.find('input[type="text"]')
                        console.log( $inputs )
                        $inputs.focus(  function () {
                            $parentFormElement.addClass('input-focus')
                            /*console.log( self.__param.selectors )
                            var Height = document.getElementById('quickorderpopup').offsetHeight
                            var HeightB = document.body.offsetHeight
                            $('#quickorderpopup .header').text( HeightB + '/' +Height )*/
                        }).focusout(function (){
                            $parentFormElement.removeClass('input-focus')
                        });

                    },
                    afterClose  : function () {},
                });
            });
        }
    };
    this.Init();
}
window.QuickorderDriver.prototype = new GNZ11() ;





























