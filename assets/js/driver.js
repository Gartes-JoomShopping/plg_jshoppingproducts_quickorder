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

    this.selectors = {
        btn : 'span.quickorder'
    };
    this.Init = function ()
    {
        this.getProduct()
        this.getForm();
    };
    this.getProduct = function () {
        var $ElementProduct = $(onElement).closest('.product');
        self.product_id = $ElementProduct.data('product_id')
        self.category_id = $ElementProduct.data('category_id')
    }
    this.getForm = function () {
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

            console.log(html)
        }
        function modalOpen(html) {
            // var h = $(html).find('.container-product').append( self.productHtml ).html() ;
            // console.log(h) ;
            self.__loadModul.Fancybox().then(function (a) {
                a.open( html ,{
                    baseClass : "quickorderForm",
                    touch : false , // полностью отключить сенсорные жесты default : true
                    beforeShow   : function(instance, current)   {
                        // $('.container-product').append( self.productHtml )
                    },
                    afterShow   : function(instance, current)   {
                        // $('.container-product').append( self.productHtml )
                    },
                    afterClose  : function () {},
                });
            });
        }
    };
    this.Init();
}
window.QuickorderDriver.prototype = new GNZ11() ;





























