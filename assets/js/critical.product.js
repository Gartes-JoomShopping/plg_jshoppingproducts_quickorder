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
        var self = this;
        var QuickorderSesData ;
        var Element ;
        this.__plugin = 'quickorder';
        this.__params = Joomla.getOptions(this.__plugin, {});

        QuickorderSesData = JSON.parse( sessionStorage.getItem(this.__params.sessionStorageKey ) );

        if ( !QuickorderSesData ){
            $( self.__params.selectors.quickorderBtn ).parent()
                .addClass(this.__params.quickorderBtnOn)
                .on('click.quickorder' , self.__params.selectors.quickorderBtn , function () {
                    Element = this ;
                    wgnz11.load.js( wgnz11.Options.Ajax.siteUrl+'plugins/jshoppingproducts/quickorder/assets/js/driver.js?'+self.__params.version ).then(function (a) {
                        new QuickorderDriver(Element);
                    },function (err) { console.error(err)})
            });
        }else{
            wgnz11.load.js( wgnz11.Options.Ajax.siteUrl+'plugins/jshoppingproducts/quickorder/assets/js/sessionStorageContoller.js?'+self.__params.version );
        }
        console.log('QuickorderSesData' , QuickorderSesData)
    }
},500);

