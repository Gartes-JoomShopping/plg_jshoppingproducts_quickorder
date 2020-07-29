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
            Ajax.send( data ).then( function ( r )
            {

                Promise.all([
                    // wgnz11.load.css( _host + 'plugins/jshoppingproducts/quickorder/assets/style.css') ,
                    // wgnz11.load.js( _host + 'plugins/jshoppingproducts/quickorder/assets/script.js') ,

                ]).then(function ( a)
                {
                    // $('body').append( r.data.form )
                    quickOrder.openForm(elem,cid,pid)
                })
            } , function ( err ) { console.error( err ) })
        });
    }
    console.log(event);

};