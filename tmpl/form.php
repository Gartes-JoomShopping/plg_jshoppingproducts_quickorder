<?php
/**
* @package Joomla
* @subpackage JoomShopping
* @author Nevigen.com
* @website https://nevigen.com/
* @email support@nevigen.com
* @copyright Copyright © Nevigen.com. All rights reserved.
* @license Proprietary. Copyrighted Commercial Software
* @license agreement https://nevigen.com/license-agreement.html
**/

use Joomla\CMS\Language\Text;

defined('_JEXEC') or die;



?>
<div id="quickorderpopup">
	<div class="quickord_wrapper">
		<form class="form-horizontal" action="" method="POST" onsubmit="return quickOrder.submitForm()">
            <?php echo JHtml::_( 'form.token' ); ?>
			<div class="header"> <?php echo JText::_('PLG_JSHOPPINGPRODUCTS_QUICKORDER_LINK');?> </div>
			<div class="container-product"><?= $this->productHtml ?></div>
            <div class="header product_name"></div>
			<div class="clearfix"> </div>
            <input type="text" style="width: 0px;
    min-width: 0;
    height: 0px;
    border: none;
    padding: 0;
    position: absolute;">
			<?php if ($this->addonParams->show_f_name)
			{ ?>
				<div class="quickorderformrow control-group">
						<div class="input-prepend">
						  <input type="text" name="f_name" value="<?php print $adv_user->f_name ?>" <?php if ($this->addonParams->show_f_name == 1) { ?>data-required<?php } ?> placeholder="<?php echo JText::_('PLG_JSHOPPINGPRODUCTS_QUICKORDER_USER_F_NAME');if ($this->addonParams->show_f_name == 1) echo JText::_('PLG_JSHOPPINGPRODUCTS_QUICKORDER_REQUIRED'); ?>" />
					</div>
				</div>
			<?php
			} ?>
			<?php if ($this->addonParams->show_l_name)
			{ ?>
                <div class="quickorderformrow control-group">
                    <div class="input-prepend ">
                        <?php
                        $placeholder_input_l_name = Text::_('PLG_JSHOPPINGPRODUCTS_QUICKORDER_USER_L_NAME');
                        $placeholder_input_l_name .= ($this->addonParams->show_l_name?JText::_('PLG_JSHOPPINGPRODUCTS_QUICKORDER_REQUIRED') : null ) ;
//                       /* placeholder="" */
                        ?>
                        <input type="text"
                               name="l_name" value="<?= $adv_user->l_name ?>"
                               <?= ($this->addonParams->show_l_name?'data-required' : null )?>
                               />
                        <label for="l_name">
                            <?= $placeholder_input_l_name ?>
                        </label>
                    </div>
                </div>
            <?php
			}

			if ($this->addonParams->show_phone) { ?>
				<div class="quickorderformrow control-group">
                    <div class="input-prepend">
                        <?php
                        $placeholder_input_tel = Text::_('PLG_JSHOPPINGPRODUCTS_QUICKORDER_USER_PHONE') ;
                        $placeholder_input_tel .= ($this->addonParams->show_phone ? Text::_('PLG_JSHOPPINGPRODUCTS_QUICKORDER_REQUIRED'):null ) ;

                         /*
                          * placeholder="<?= $placeholder_input_tel ?>"
                          */
                        ?>
                        <input type="text" class=" jmp__input_tel" name="phone"
                               value="<?php print $adv_user->{$this->addonParams->which_phone} ?>"
                               <?= ( $this->addonParams->show_phone ? 'data-required' : null )?>
                                />
                        <label for="phone"><?= $placeholder_input_tel ?></label>
                    </div>
				</div>
			<?php }

			if ($this->addonParams->show_email) { ?>
				<div class="quickorderformrow control-group">
					<div class="input-prepend">
					  
					  <input type="text" name="email" value="<?php print $adv_user->email ?>" <?php if ($this->addonParams->show_email == 1) { ?>data-required<?php } ?> placeholder="<?php
				echo JText::_('PLG_JSHOPPINGPRODUCTS_QUICKORDER_USER_EMAIL');if ($this->addonParams->show_email == 1) echo JText::_('PLG_JSHOPPINGPRODUCTS_QUICKORDER_REQUIRED'); ?>" />
					</div>
				</div>
			<?php }

			if ($this->addonParams->show_comment) { ?>
				<div class="quickorderformrow control-group">
					<textarea name="comment" rows="4" <?php if ($this->addonParams->show_comment == 1) { ?>data-required<?php } ?> placeholder="<?php
					echo JText::_('PLG_JSHOPPINGPRODUCTS_QUICKORDER_USER_COMMENT'); if ($this->addonParams->show_comment == 1) echo JText::_('PLG_JSHOPPINGPRODUCTS_QUICKORDER_REQUIRED'); ?>"></textarea>
				</div>
			<?php } ?>

            <div class="quickorder-footer">
                <div class="quickorderformrow control-group submit">

                    <div class="input-prepend">
                        <div class="btn-wrp float-right">
                            <button type="submit" class="btn btn-info button disabled">
                                <?=JText::_('PLG_JSHOPPINGPRODUCTS_QUICKORDER_SUBMIT') ?>
                            </button>
                        </div>

                    </div>

                </div>
            </div>


			<input type="hidden" name="option" value="com_jshopping" />
			<input type="hidden" name="controller" value="cart" />
			<input type="hidden" name="task" value="add" />
			<input type="hidden" name="to" value="quickorder_checkout" />
			<input type="hidden" name="category_id" />
			<input type="hidden" name="product_id" />
			<?php echo JHtml::_( 'form.token' ) ?>
		</form>
	</div>
</div>