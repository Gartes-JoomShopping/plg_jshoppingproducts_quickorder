window.ProductFormsDriver = function ( Element ){
    var $ = jQuery ;
    var self = this ;
    this.__group = 'jshoppingproducts' ;
    this.__plugin = 'quickorder' ;
    this.__param = Joomla.getOptions( this.__plugin , {} );
    this.selectors = this.__param.selectors ;
    this.Host = self.Options.Ajax.siteUrl ;
    // Ключ для sessionStorage
    this.sessionStorageKey = 'FormsDriver' ;
    this.AjaxDefaultData = {
        group : this.__group,
        plugin : this.__plugin ,
        option : 'com_ajax' ,
        format : 'json' ,
        task : null ,
    };
    //  Шаблон маски поля
    this.InputmaskSettings = {
        // Can be '+38(000)000-00-00'
        mask  : self.__param.phoneMask ,
        element : self.selectors.phoneMaskElement ,
        onComplete : self.onMaskComplete ,
        onKeyPress: self.onMaskKeyPress ,
    };

    this.formType = null ;
    this.category_id = null ;
    this.product_id = null ;

    this.Init = function ()
    {
        self.selectors.form = '#forms_extensions'

        self.formType = $(Element).data('form_type');
        self.template = $(Element).data('template');
        self.load.css( self.Host+'plugins/jshoppingproducts/quickorder/assets/css/forms_extensions.css?'+self.__param.version )
            .then(function (){
                self.getProduct();
                self.getForm();
            },function (err){console.log(err)})

        console.log( this.__param )

    }


    /**
     * Получить данные о товаре ( category_id && product_id )
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
     * Получение формы
     */
    this.getForm = function (){
        var Data = {
            product_id : self.product_id ,
            category_id : self.category_id ,
            formType : self.formType ,
            template  : self.template ,

        } ;
        var data = $.extend( true , this.AjaxDefaultData , Data );
        data.method = 'getExtensionsForm';
        self.getModul( "Ajax" ).then( function ( Ajax ) {
            // Не обрабатывать сообщения
            Ajax.ReturnRespond = true;
            Ajax.send( data ).then(  self.renderForm )
        },function (err) { console.log(err)});
    };

    this.renderForm = function (r){
        var theme = r.data.params.theme
        self.load.css( self.Host+'plugins/jshoppingproducts/quickorder/assets/css/themes/'+theme+'.css?'+self.__param.version ).then(
            function () {
                self.modalOpen(r)
            },function (err) { console.log(err) }
        );

        console.log( r )
    }

    this.modalExtensionsForm = null ;

    this.modalOpen = function (r){
        self.__loadModul.Fancybox().then(function (a) {
            self.modalExtensionsForm = a.open( r.data.html ,{
                baseClass : "quickorderForm extensions-form",
                touch : false ,
                afterShow   : function(instance, current)   {

                    var $form = $(self.selectors.form)
                    $form.find('[name="category_id"]').val( self.category_id );
                    $form.find('[name="product_id"]').val( self.product_id );

                    // Ставим маску на поле телефона
                    self.addMask();
                    // Добавить слушателей событий
                    self.addEventListener();

                    // Отправка формы
                    $form.on('submit.quickorderForm' , function (event) {
                        event.preventDefault();
                        var $form = $(this);
                        var Data = $form.serialize();
                        self.getModul( "Ajax" ).then( function ( Ajax )
                        {
                            Ajax.send( Data ).then( function ( r )
                            {
                                // Закрыть текущие окно
                                self.modalExtensionsForm.close();
                                // Показать окно с информацией - заказ принят
                                self.modalOrderAcceptOpen(r.data.html);
                                console.log( r );
                            });
                        });

                    });

                    // После принятия заказа сделать кнопку для быстрого заказа не активной
                    // quickorderBtnOff() ;

                },
            })
        })
    }





    this.Init();
}

// window.ProductFormsDriver.prototype = new GNZ11() ;
window.ProductFormsDriver.prototype = new window.ProductsQuickorderDriver() ;

