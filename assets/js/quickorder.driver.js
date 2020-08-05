/**
 * Быстрый заказ
 * @param onElement
 * @constructor
 */
window.QuickorderDriver = function ( onElement ) {
    var $ = jQuery ;
    var self = this ;


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
            console.log( self.$ElementProduct )
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
            var _host = self.Options.Ajax.siteUrl
            var _v = self.__param.version
            self.theme = r.data.params.theme ;
            self.productHtml = r.data.product ;
            var html = r.data.form
            self.load.css(_host +'plugins/jshoppingproducts/quickorder/assets/css/themes/'+self.theme+'.css?'+_v)
                .then( function () {
                    modalOpen(html)
                },function (err) { console.log(err) }
            );


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
                        self.addMask();

                        // Добавить слушателей событий
                        self.addEventListener()

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
                                    self.modalOrderAcceptOpen(r.data.html);
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

                            /*var Height = document.getElementById('quickorderpopup').offsetHeight
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
window.QuickorderDriver.prototype = new window.ProductsQuickorderDriver() ;





























