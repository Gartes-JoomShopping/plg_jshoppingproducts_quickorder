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

defined('_JEXEC') or die;
?>

<!--onclick="quickOrder.openForm(this,--><?php //echo $product->category_id ?><!--,--><?php //echo $product->product_id ?><!--)"-->

<span class="btn btn-info quickorder"
      onclick="quickOrder._start(event)"
      data-name="<?php echo htmlspecialchars($product->name) ?>">
	<?php echo JText::_('PLG_JSHOPPINGPRODUCTS_QUICKORDER_LINK') ?>
</span>