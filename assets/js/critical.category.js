setTimeout(function () {
    var $ = jQuery ;
    if (typeof wgnz11 === 'undefined' ){
        var I = setInterval(function () {
            if (typeof wgnz11 === 'undefined' ) return ;
            clearInterval( I );
            new QuickorderStart()
        },250 )
    }else{
        new QuickorderStart()
    }

    function QuickorderStart() {
        var self = this ;
        this.__plugin = 'quickorder' ;
        this.__params = Joomla.getOptions( this.__plugin , {} );
        var QuickorderSesData = JSON.parse( sessionStorage.getItem(this.__params.sessionStorageKey ) );

        if ( QuickorderSesData ) {
            wgnz11.load.js( wgnz11.Options.Ajax.siteUrl+'plugins/jshoppingproducts/quickorder/assets/js/sessionStorageContoller.js?'+self.__params.version );
        }else{
            $('.block_product .product').addClass('quickorder-on');
            $('.quickorder-on').on('click.quickorder' ,'.quickorder.btn' , function () {
                var Element = this ;
                wgnz11.load.js( wgnz11.Options.Ajax.siteUrl+'plugins/jshoppingproducts/quickorder/assets/js/driver.js?'+self.__params.version ).then(function (a) {
                    new QuickorderDriver(Element);
                },function (err) { console.error(err)})
            });
        }
    }
},500);