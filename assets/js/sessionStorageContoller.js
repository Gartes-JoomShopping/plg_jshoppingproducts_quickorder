window.sessionStorageContoller = function ( onElement ) {
    var $ = jQuery ;
    var self = this ;
    this.__group = 'jshoppingproducts' ;
    this.__plugin = 'quickorder' ;
    this.__params = Joomla.getOptions( this.__plugin , {} );

    var _v = this.__params.version ;
    var _host = wgnz11.Options.Ajax.siteUrl ;

    this.Init = function () {

        if ( this.__params.controller === "product" ) {

        }

        var QuickorderSesData = JSON.parse( sessionStorage.getItem( this.__params.sessionStorageKey ) );

        $.each(QuickorderSesData.product_id , function (i,a) {
            if ( self.__params.controller === "product" ) {
                if ( a ===  self.__params.product_id ) {
                    $( self.__params.selectors.quickorderBtn ).parent().addClass('quickorder-ordered')
                }
            }else{
                $(self.__params.selectors.blockProduct+'[data-product_id="'+a+'"]').addClass('quickorder-ordered')
            }
        });
        if ( this.__params.controller === "product" ) {
            !$(self.__params.selectors.quickorderBtn).parent().not('.quickorder-ordered').addClass('quickorder-on')
        }else{
            $(self.__params.selectors.blockProduct+':not(.quickorder-ordered)').addClass('quickorder-on');
        }



        $('.quickorder-on').on('click.quickorder' , this.__params.selectors.quickorderBtn , function () {
            var Element = this ;
            wgnz11.load.js( _host+'plugins/jshoppingproducts/quickorder/assets/js/driver.js?'+_v )
                .then(function (){
                    wgnz11.load.js( _host+'plugins/jshoppingproducts/quickorder/assets/js/quickorder.driver.js?'+_v )
                        .then(function (a) {
                            new QuickorderDriver(Element);
                        },function (err) { console.error(err)})
                })
        });


        console.log(this.__params.selectors.blockProduct)

        console.log(QuickorderSesData.product_id)
    }
    this.Init();

}
new sessionStorageContoller()