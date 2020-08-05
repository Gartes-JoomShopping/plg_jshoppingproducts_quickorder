window.ProductsQuickorderDriver = function (){
    var $ = jQuery ;
    var self = this ;
    this.__group = 'jshoppingproducts' ;
    this.__plugin = 'quickorder' ;
    this.__param = Joomla.getOptions( this.__plugin , {} );
    // Ключ для sessionStorage
    this.sessionStorageKey = 'Quickorder' ;

    this.selectors = {
        form : '#quickorderpopup form' ,
        btn : 'span.quickorder' ,
        phoneMaskElement : '.jmp__input_tel',
    };
    console.log(this.__param)
    /**
     * параметры маски поля
     * @type {{onComplete: Window.ProductsQuickorderDriver.onMaskComplete, onKeyPress: Window.ProductsQuickorderDriver.onMaskKeyPress, mask: *, element: string}}
     */
    this.InputmaskSettings = {
        //  Шаблон маски поля
        // Can be '+38(000)000-00-00'
        mask  : this.__param.phoneMask ,
        element : this.selectors.phoneMaskElement ,
        onComplete : this.onMaskComplete ,
        onKeyPress: this.onMaskKeyPress ,
    }

    /**
     * Валидация формы БЫСТРОГО ЗАКАЗА
     */
    this.formValid = function () {

        console.log( self )
        console.log( this )




        var $required = $(self.selectors.form).find('[data-required]');
        var validResult = true ;

        $.each($required , function (i,a) {
            var val = $(a).val();
            if (!val.length || $(a).hasClass('error')) validResult = false ;
        })
        if ( !$('.jmp__input_tel').hasClass('Mask-Complete') )  validResult = false ;

        // Проверка на пустое значение поля
        $(self.selectors.form).find('input[type="text"] , textarea').each(function (i,a){
            if ( $(a).val()    ){
                $(a).addClass('no-empty')
            }else{
                $(a).removeClass( 'no-empty' )
            }
        });
        self.BtnControl(validResult)
    }
    /**
     * Включить отключить кнопку для отправки формы БЫСТРОГО ЗАКАЗА
     * Если эта форма не проходит валидацию
     * @param validResult
     * @constructor
     */
    this.BtnControl = function ( validResult ) {
        var $btn = $(self.selectors.form).find('button[type="submit"]')
        console.log( $btn )


        if (validResult){
            $btn.removeClass('disabled')
        }else{
            $btn.addClass('disabled')
        }
    }

    /**
     * Добавить слушателей событий
     */
    this.addEventListener = function (){
        var $form = $(self.selectors.form)
        $form.find( 'input[type="text"] , textarea' ).on( 'keyup' , self.formValid );
        $form.find('label').on('click',function (){
            $(this).parent().find('input[type="text"], textarea').focus();
        })
    }
    /**
     * Ставим маску на поле телефона
     */
    this.addMask = function (){
       self.getPlugin('Inputmask'  ).then(function ( Inputmask ) {
            var $inputPhone = $(self.InputmaskSettings.element) ;
            $inputPhone.on('focus._maskInit',function () {
                Inputmask.Inint( self.InputmaskSettings.element , self.InputmaskSettings );
                $inputPhone.off('focus._maskInit');
                $inputPhone.focus()
            });
        });
    }
    /**
     * Событие маска заполнена
     * @param val
     * @param event
     * @param currentField
     * @param d
     */
    this.onMaskComplete = function (val , event , currentField , d) {
        $( currentField ).addClass('Mask-Complete');
        self.formValid();
    }
    /**
     * Событие нажатие кнопок маски
     * @param val
     * @param event
     * @param currentField
     * @param options
     */
    this.onMaskKeyPress = function (val,event,currentField,options) {
        var maskDl = InputmaskSettings.mask.replace(/[^\d;]/g, '').length ;
        var valDl = val.replace(/[^\d;]/g, '').length ;
        if ( maskDl !== valDl ) {
            $(currentField).removeClass('Mask-Complete');
            self.BtnControl(false ) ;
        }
    }

    /**
     * Показать окно с информацией - заказ принят
     * @param html
     */
    this.modalOrderAcceptOpen = function(html) {
        console.log( self   )
        console.log( self.__params  )
        self.__loadModul.Fancybox().then(function (a) {
            a.open( html ,{
                baseClass : "quickorderForm",
                afterShow   : function(instance, current)   {
                    // Установка таймера Fancybox до закрытия
                    a.setTimeOut(self.__param.Fancybox.TimeOutModalAccept);
                    // После принятия заказа сделать кнопку для быстрого заказа не активной
                    self.quickorderBtnOff() ;

                },
            })
        })
    }
    /**
     * После принятия заказа сделать кнопку для быстрого заказа в товаре не активной
     */
    this.quickorderBtnOff = function() {
        $(self.__param.selectors.quickorderBtn)
            .parent()
            .toggleClass( 'quickorder-on quickorder-ordered' )
            .off( 'click.quickorder' ) ;
    }


}
window.ProductsQuickorderDriver.prototype = new GNZ11();
