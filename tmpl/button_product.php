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
<span class="btn btn-info quickorder" onclick="quickOrder.openForm(this,<?php echo $view->category_id ?>,<?php echo $view->product->product_id ?>)" data-name="<?php echo htmlspecialchars($view->product->name) ?>">
	<?php echo JText::_('PLG_JSHOPPINGPRODUCTS_QUICKORDER_LINK') ?>
</span>