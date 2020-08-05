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
        var _v = self.__params.version ;
        var _host = wgnz11.Options.Ajax.siteUrl ;
        var QuickorderSesData = JSON.parse( sessionStorage.getItem(this.__params.sessionStorageKey ) );

        if ( QuickorderSesData ) {
            wgnz11.load.js( _host+'plugins/jshoppingproducts/quickorder/assets/js/sessionStorageContoller.js?'+_v );
        }else{
            $('.block_product .product').addClass('quickorder-on');
            $('.quickorder-on').on('click.quickorder' ,'.quickorder.btn' , function () {
                var Element = this ;
               /* wgnz11.load.js( _host+'plugins/jshoppingproducts/quickorder/assets/js/driver.js?'+_v )
                    .then(function (a) {
                        new QuickorderDriver(Element);
                    },function (err) { console.error(err)})*/
                wgnz11.load.js( _host+'plugins/jshoppingproducts/quickorder/assets/js/driver.js?'+_v )
                    .then(function (){
                        wgnz11.load.js( _host+'plugins/jshoppingproducts/quickorder/assets/js/quickorder.driver.js?'+_v )
                            .then(function (a) {
                                new QuickorderDriver(Element);
                            },function (err) { console.error(err)})
                    })
            });
        }
    }
},500);






















