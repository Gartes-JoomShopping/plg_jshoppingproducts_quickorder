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
        this.__plugin = 'quickorder';
        this.__params = Joomla.getOptions(this.__plugin, {});
        var self = this;
        var QuickorderSesData ;
        var Element ;
        var _v = self.__params.version ;
        var _host = wgnz11.Options.Ajax.siteUrl ;



        QuickorderSesData = JSON.parse( sessionStorage.getItem(this.__params.sessionStorageKey ) );

        if ( !QuickorderSesData ){
            $( self.__params.selectors.quickorderBtn ).parent()
                .addClass(this.__params.quickorderBtnOn)
                .on('click.quickorder' , self.__params.selectors.quickorderBtn , function () {
                    Element = this ;
                    wgnz11.load.js( _host+'plugins/jshoppingproducts/quickorder/assets/js/driver.js?'+_v )
                        .then(function (){
                            wgnz11.load.js( _host+'plugins/jshoppingproducts/quickorder/assets/js/quickorder.driver.js?'+_v )
                                .then(function (a) {
                                    new QuickorderDriver(Element);
                                },function (err) { console.error(err)})
                        })
                });
        }else{
            wgnz11.load.js( _host+'plugins/jshoppingproducts/quickorder/assets/js/sessionStorageContoller.js?'+_v );
        }

    }
},500);

