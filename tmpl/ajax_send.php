<?php
/**
 * Шаблон письма
 *
 * @package     ${plgJshoppingProductsQuickOrder}
 * @subpackage
 *
 * @copyright   A copyright
 * @license     A "Slug" license name e.g. GPL2
 */


if( $this->Data['product'] )
{
    ?>
    <h1><?= $this->Data['subject'] .' : '. $this->Data['product'] ?>
        <span style="color:#ff7700">Код: <?=$this->Data['product_ean']?></span>
    </h1>
    <?php
}else{
    ?>
    <h1><?= $this->Data['subject'] ?></h1>
    <?php
}#END IF

?>


<div style="width: 100%; float:left" class="row">
    <div style="width: 250px; float: left;" class="label">Имя : </div>
    <div style="float: left" class="value"><?=$this->Data['l_name']?></div>
</div>
<div style="width: 100%; float:left" class="row">
    <div style="width: 250px; float: left;" class="label">Телефон : </div>
    <div style="float: left" class="value"><?=$this->Data['phone']?></div>
</div>
<div style="width: 100%; float:left" class="row">
    <div style="width: 250px; float: left;" class="label">E-mail : </div>
    <div style="float: left" class="value"><?=$this->Data['email']?></div>
</div>
<div style="width: 100%; float: left ;" class="row">
    <div style="width: 250px; float: left;" class="label">Сообщение : </div>
    <div style="float: left" class="value"><?=$this->Data['message']?></div>
</div>
<hr />
<div class="row">Время заполнения формы: <?= $this->Data['deltaT'] ?> сек.</div>
<div class="row">Уровень защиты reCAPTCHA score : <?= $this->Data['RecaptchaScore'] ?> сек.</div>
<div class="row">IP Адрес : <?= $_SERVER['REMOTE_ADDR'] ?> сек.</div>

<!--
<div style="width: 100%; float:left" class="row">
    <div style="width: 250px" class="label"></div>
    <div style="float: left" class="value"><?/*=$this->Data['']*/?></div>
</div>

-->

<?php
