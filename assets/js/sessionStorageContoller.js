window.sessionStorageContoller = function ( onElement ) {
    var $ = jQuery ;
    var self = this ;
    this.__group = 'jshoppingproducts' ;
    this.__plugin = 'quickorder' ;
    this.__params = Joomla.getOptions( this.__plugin , {} );
    this.Init = function () {

        if ( this.__params.controller === "product" ) {

        }

        console.log(this.__params )
        console.log(this.__params.selectors.quickorderBtn )

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
            wgnz11.load.js( wgnz11.Options.Ajax.siteUrl+'plugins/jshoppingproducts/quickorder/assets/js/driver.js?'+self.__params.version ).then(function (a) {
                new QuickorderDriver(Element);
            },function (err) { console.error(err)})
        });


        console.log(this.__params.selectors.blockProduct)

        console.log(QuickorderSesData.product_id)
    }
    this.Init();

}
new sessionStorageContoller()