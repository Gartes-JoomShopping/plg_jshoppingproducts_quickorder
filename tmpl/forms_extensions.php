<?php
/**
 * @package     ${NAMESPACE}
 * @subpackage
 *
 * @copyright   A copyright
 * @license     A "Slug" license name e.g. GPL2
 */ ?>
<div id="quickorderpopup" class="plg-quickorder">
    <form id="forms_extensions">
        <input type="hidden" name="subject" value="<?= $this->DataTemplate['title'] ?>">
        <input type="hidden" name="product" value="<?= $this->productData['name']?>">
        <input type="hidden" name="product_ean" value="<?= $this->productData['product_ean']?>">


        <input type="hidden" name="group" value="jshoppingproducts">
        <input type="hidden" name="plugin" value="quickorder">

        <input type="hidden" name="option" value="com_ajax">
        <input type="hidden" name="format" value="json">

        <input type="hidden" name="method" value="Send">




        <div  class="forms-extensions">
            <div class="forms-extensions-header">
                <div class="b1c-tl">
                    <span class="b1c-title-name">
                        <?= $this->DataTemplate['title'] ?>
                        <span class="product-name">
                            <?= $this->productData['name']?>
                        </span>
                        <span class="product_ean">
                           Код: <?= $this->productData['product_ean']?>
                        </span>
                    </span>
                </div>
                <div class="b1c-description">
                    Чтобы оформить заявку, заполните форму.
                </div>
            </div>
            <div class="forms-extensions-">

            </div>
            <div class="forms-extensions-body">
                <div class="forms-extensions-fields">
                    <div class="quickorderformrow control-group">
                        <div class="input-prepend ">
                            <input type="text" name="l_name" value="" data-required="" maxlength="25">
                            <label for="l_name">
                                Ваше имя (обязательное)                        </label>
                        </div>
                    </div>
                    <div class="quickorderformrow control-group">
                        <div class="input-prepend">
                            <input type="text" class=" jmp__input_tel" name="phone" value="" data-required="">
                            <label for="phone">Телефон (обязательное)</label>
                        </div>
                    </div>
                    <div class="quickorderformrow control-group">
                        <div class="input-prepend">
                            <input type="text" class=" jmp__input_Email" name="email" value="" maxlength="150">
                            <label for="phone">E-mail</label>
                        </div>
                    </div>
                    <div class="quickorderformrow control-group">
                        <div class="input-prepend">
                            <textarea maxlength="512" name="message"  class="b1c-txtin"></textarea>
                            <label for="phone">Сообщение</label>
                        </div>
                    </div>
                </div>
                <div class="forms-extensions-fields tos">
                    <div class="row_agb uk-container-center uk-text-center" style="font-size: 10px; text-align: left;">
                        <input type="checkbox" checked="" name="agb" id="agb" placeholder="" style="width: 20px;">
                        <span>
                    <a href="https://pro-spec.ru/soglasie-na-obrabotku-personalnykh-dannykh" target="_blank">
                        Согласие на обработку персональных данных
                    </a>
                </span>
                    </div>
                </div>
            </div>
            <div class="quickorder-footer">
                <div class="quickorderformrow control-group submit">

                    <div class="input-prepend">
                        <div class="btn-wrp float-right">
                            <button type="submit" class="btn btn-info button disabled">
                                Отправить                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!--<div class="forms-extensions-footer">
                <div class="b1c-submit-area">

                    <button type="submit" class="b1c-submit" >
                        Оформить заявку
                    </button>


                </div>
            </div>-->

        </div>
    </form>

</div>

